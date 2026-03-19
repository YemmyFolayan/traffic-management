"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { DEMO_INTERSECTIONS } from "@/lib/demo-data";
import { DemoDataNotice } from "@/components/dashboard/demo-data-notice";
import type { Intersection } from "@/types";
import { UserRole } from "@/types";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

const emptyForm = {
  name: "",
  latitude: "",
  longitude: "",
  laneCount: "",
  capacity: "",
  status: "ACTIVE" as Intersection["status"],
};

function statusBadge(status: Intersection["status"]) {
  switch (status) {
    case "ACTIVE":
      return <Badge variant="success">ACTIVE</Badge>;
    case "INACTIVE":
      return <Badge variant="secondary">INACTIVE</Badge>;
    case "MAINTENANCE":
      return <Badge variant="warning">MAINTENANCE</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function IntersectionsPage() {
  const user = useAuthStore((s) => s.user);
  const canManage =
    user?.role === UserRole.ADMIN || user?.role === UserRole.OPERATOR;

  const [rows, setRows] = useState<Intersection[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Intersection | null>(null);
  const [deleting, setDeleting] = useState<Intersection | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [demoData, setDemoData] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getIntersections();
      if (res.status && res.entity) {
        setRows(res.entity);
        setDemoData(false);
      } else {
        setRows(DEMO_INTERSECTIONS);
        setDemoData(true);
      }
    } catch {
      setRows(DEMO_INTERSECTIONS);
      setDemoData(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (row: Intersection) => {
    setEditing(row);
    setForm({
      name: row.name,
      latitude: String(row.latitude),
      longitude: String(row.longitude),
      laneCount: String(row.laneCount),
      capacity: String(row.capacity),
      status: row.status,
    });
    setFormOpen(true);
  };

  const submitForm = async () => {
    const lat = Number(form.latitude);
    const lng = Number(form.longitude);
    const lanes = Number(form.laneCount);
    const cap = Number(form.capacity);
    if (!form.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    if (
      Number.isNaN(lat) ||
      Number.isNaN(lng) ||
      Number.isNaN(lanes) ||
      Number.isNaN(cap)
    ) {
      toast({ title: "Invalid numeric fields", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        const res = await api.updateIntersection(editing.id, {
          name: form.name.trim(),
          latitude: lat,
          longitude: lng,
          laneCount: lanes,
          capacity: cap,
          status: form.status,
        });
        if (!res.status || !res.entity) {
          throw new Error(res.error?.message ?? "Update failed");
        }
        toast({ title: "Intersection updated" });
      } else {
        const res = await api.createIntersection({
          name: form.name.trim(),
          latitude: lat,
          longitude: lng,
          laneCount: lanes,
          capacity: cap,
          status: form.status,
        });
        if (!res.status || !res.entity) {
          throw new Error(res.error?.message ?? "Create failed");
        }
        toast({ title: "Intersection created" });
      }
      setFormOpen(false);
      await load();
    } catch (e) {
      toast({
        title: "Save failed",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      const res = await api.deleteIntersection(deleting.id);
      if (!res.status) {
        throw new Error(res.error?.message ?? "Delete failed");
      }
      toast({ title: "Intersection deleted" });
      setDeleteOpen(false);
      setDeleting(null);
      await load();
    } catch (e) {
      toast({
        title: "Delete failed",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <DemoDataNotice show={demoData} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            Intersections
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage junctions, capacity, and maintenance state.
          </p>
        </div>
        {canManage && (
          <Button onClick={openCreate} className="shrink-0 gap-2">
            <Plus className="h-4 w-4" />
            Add Intersection
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Network junctions</CardTitle>
          <CardDescription>
            All registered intersections available to simulation and analytics.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Lanes</TableHead>
                  <TableHead className="text-right">Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  {canManage && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={canManage ? 6 : 5}
                      className="text-center text-muted-foreground"
                    >
                      No intersections yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.id} className="transition-colors">
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {row.latitude.toFixed(4)}, {row.longitude.toFixed(4)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {row.laneCount}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {row.capacity}
                      </TableCell>
                      <TableCell>{statusBadge(row.status)}</TableCell>
                      {canManage && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8"
                              onClick={() => openEdit(row)}
                            >
                              <Pencil className="mr-1 h-3.5 w-3.5" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-8"
                              onClick={() => {
                                setDeleting(row);
                                setDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="mr-1 h-3.5 w-3.5" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit intersection" : "Add intersection"}
            </DialogTitle>
            <DialogDescription>
              Coordinates use decimal degrees. Capacity is vehicles per signal
              cycle (approx).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  inputMode="decimal"
                  value={form.latitude}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, latitude: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  inputMode="decimal"
                  value={form.longitude}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, longitude: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="lanes">Lane count</Label>
                <Input
                  id="lanes"
                  type="number"
                  min={1}
                  value={form.laneCount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, laneCount: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cap">Capacity</Label>
                <Input
                  id="cap"
                  type="number"
                  min={1}
                  value={form.capacity}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, capacity: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    status: v as Intersection["status"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                  <SelectItem value="MAINTENANCE">MAINTENANCE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void submitForm()} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete intersection?</DialogTitle>
            <DialogDescription>
              This will remove{" "}
              <span className="font-medium text-foreground">
                {deleting?.name}
              </span>{" "}
              from the network. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => void confirmDelete()}
              disabled={saving}
            >
              {saving ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
