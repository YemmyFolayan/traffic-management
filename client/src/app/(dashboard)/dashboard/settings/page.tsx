"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { DEMO_USERS } from "@/lib/demo-data";
import { DemoDataNotice } from "@/components/dashboard/demo-data-notice";
import type { User } from "@/types";
import { UserRole } from "@/types";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const isAdmin = user?.role === UserRole.ADMIN;

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersDemoData, setUsersDemoData] = useState(false);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [savingUser, setSavingUser] = useState(false);

  const [notifySim, setNotifySim] = useState(true);
  const [compactUi, setCompactUi] = useState(false);

  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
  }, [user?.name, user?.email]);

  const loadUsers = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingUsers(true);
    try {
      const res = await api.getUsers();
      if (res.status && res.entity) {
        setUsers(res.entity);
        setUsersDemoData(false);
      } else {
        setUsers(DEMO_USERS);
        setUsersDemoData(true);
      }
    } catch {
      setUsers(DEMO_USERS);
      setUsersDemoData(true);
    }
    setLoadingUsers(false);
  }, [isAdmin]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      await updateProfile({ name: name.trim(), email: email.trim() });
      toast({ title: "Profile updated" });
    } catch (e) {
      toast({
        title: "Update failed",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const submitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwNew || pwNew !== pwConfirm) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Password change",
      description:
        "Connect POST /auth/change-password (or similar) on the API to enable this action.",
    });
    setPwCurrent("");
    setPwNew("");
    setPwConfirm("");
  };

  const updateRole = async (id: string, role: UserRole) => {
    setSavingUser(true);
    try {
      const res = await api.updateUser(id, { role });
      if (!res.status || !res.entity) {
        throw new Error(res.error?.message ?? "Update failed");
      }
      setUsers((prev) => prev.map((u) => (u.id === id ? res.entity! : u)));
      toast({ title: "User updated" });
    } catch (e) {
      toast({
        title: "Could not update user",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setSavingUser(false);
    }
  };

  const confirmDeleteUser = async () => {
    if (!deleteUser) return;
    setSavingUser(true);
    try {
      const res = await api.deleteUser(deleteUser.id);
      if (!res.status) throw new Error(res.error?.message ?? "Delete failed");
      setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
      toast({ title: "User removed" });
      setDeleteUser(null);
    } catch (e) {
      toast({
        title: "Delete failed",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setSavingUser(false);
    }
  };

  return (
    <div className="space-y-6">
      {isAdmin && <DemoDataNotice show={usersDemoData} />}
      <div>
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
          Settings
        </h2>
        <p className="text-sm text-muted-foreground">
          Profile, access control, and workspace preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList
          className={cn(
            "grid w-full max-w-xl",
            isAdmin ? "grid-cols-3" : "grid-cols-2",
          )}
        >
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {isAdmin && <TabsTrigger value="users">Users</TabsTrigger>}
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Update how you appear across the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-lg">
              <div className="grid gap-2">
                <Label htmlFor="settings-name">Name</Label>
                <Input
                  id="settings-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="settings-email">Email</Label>
                <Input
                  id="settings-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <Button
                onClick={() => void saveProfile()}
                disabled={savingProfile}
              >
                {savingProfile ? "Saving…" : "Save changes"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change password</CardTitle>
              <CardDescription>
                Requires a secured password endpoint on the API.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitPassword} className="max-w-lg space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="pw-cur">Current password</Label>
                  <Input
                    id="pw-cur"
                    type="password"
                    value={pwCurrent}
                    onChange={(e) => setPwCurrent(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pw-new">New password</Label>
                  <Input
                    id="pw-new"
                    type="password"
                    value={pwNew}
                    onChange={(e) => setPwNew(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pw-confirm">Confirm new password</Label>
                  <Input
                    id="pw-confirm"
                    type="password"
                    value={pwConfirm}
                    onChange={(e) => setPwConfirm(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <Button type="submit" variant="secondary">
                  Update password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="users" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
                <div>
                  <CardTitle>Users</CardTitle>
                  <CardDescription>
                    Manage roles for your organization.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void loadUsers()}
                >
                  Refresh
                </Button>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                {loadingUsers ? (
                  <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-11 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center text-muted-foreground"
                          >
                            No users returned.
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell className="font-medium">{u.name}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {u.email}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={u.role}
                                onValueChange={(v) =>
                                  void updateRole(u.id, v as UserRole)
                                }
                                disabled={savingUser || u.id === user?.id}
                              >
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.values(UserRole).map((r) => (
                                    <SelectItem key={r} value={r}>
                                      {r}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                disabled={u.id === user?.id}
                                onClick={() => setDeleteUser(u)}
                                aria-label={`Delete ${u.name}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="system" className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Local UI toggles (placeholders until wired to backend).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-4 transition-colors">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-sim">Simulation alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Toast when a run completes or fails.
                  </p>
                </div>
                <Switch
                  id="notify-sim"
                  checked={notifySim}
                  onCheckedChange={setNotifySim}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-4 transition-colors">
                <div className="space-y-0.5">
                  <Label htmlFor="compact">Compact tables</Label>
                  <p className="text-sm text-muted-foreground">
                    Tighter row height on data grids.
                  </p>
                </div>
                <Switch
                  id="compact"
                  checked={compactUi}
                  onCheckedChange={setCompactUi}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove user?</DialogTitle>
            <DialogDescription>
              This will delete{" "}
              <span className="font-medium text-foreground">
                {deleteUser?.email}
              </span>
              . This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteUser(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => void confirmDeleteUser()}
              disabled={savingUser}
            >
              {savingUser ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
