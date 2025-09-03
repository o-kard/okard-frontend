"use client";

import NextLink from "next/link";
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  UserButton,
  useReverification,
  useUser,
} from "@clerk/nextjs";
import {
  Avatar,
  Box as MuiBox,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import { useEffect, useMemo, useRef, useState } from "react";
import ProfilePanel from "@/modules/user/components/UserShowPanel";
import EditPanel from "@/modules/user/components/UserEditPanel";
import ContributionsPanel from "@/modules/user/components/UserContributionsPanel";
import CampaignsPanel from "@/modules/user/components/UserCampaignsPanel";
import { getUserById, updateUser } from "@/modules/user/api/api";
import {
  isClerkAPIResponseError,
  isClerkRuntimeError,
  isReverificationCancelledError,
} from "@clerk/nextjs/errors";
import { useRequireUserInDb } from "@/hooks/useRequireUserDb";

// Optional: gate page behind DB user check
// import { useRequireUserInDb } from "@/hooks/useRequireUserInDb";

// -------------------------------
// Tabs helpers (exported for tests)
// -------------------------------
export type Tab = "profile" | "edit" | "contributions" | "campaigns";

export function getCurrentTab(sp: ReadonlyURLSearchParams): Tab {
  const t = sp.get("tab");
  if (t === "edit" || t === "contributions" || t === "campaigns") return t;
  return "profile"; // default
}

export function buildTabHref(tab: Tab) {
  return `/user?tab=${tab}`;
}

export function isActiveTab(current: Tab, tab: Tab) {
  return current === tab;
}

export function validateUsername(u: string) {
  const v = u.trim();
  if (v.length < 4 || v.length > 64)
    return "Username must be between 4 and 64 characters long.";
  if (!/^[a-zA-Z0-9._]+$/.test(v))
    return "Use only letters, numbers, dot or underscore";
  return null;
}

function validateEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
// -------------------------------
// Main page
// -------------------------------
export default function UserPage() {
  // useRequireUserInDb?.();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const sp = useSearchParams();
  const tab = useMemo(() => getCurrentTab(sp), [sp]);
  const haveUserDb = useRequireUserInDb();

  const [profile, setProfile] = useState<any | null>(null);

  // Username management
  const changeUsername = useReverification(async (uname: string) => {
    if (!user) throw new Error("No user");
    console.log("Changing username to", uname);
    return user.update({ username: uname });
  });

  async function onSubmitUsername(uname: string) {
    if (!isLoaded || !user) return;

    const vErr = validateUsername(uname);
    console.log("Validated username", uname, vErr);
    if (vErr) {
      alert(vErr);
      return false; // ❗ สำคัญ: บอกว่าไม่ผ่าน
    }
    try {
      console.log("Updating username to", uname);
      await changeUsername(uname); // useReverification ห่อไว้แล้ว
      await user.reload();
      alert("Username updated");
      return true; // ผ่าน
    } catch (e: any) {
      if (isClerkAPIResponseError(e)) {
        const msg =
          e.errors?.map((er: any) => er.longMessage || er.message).join("\n") ||
          "Username update failed";
        alert(msg);
        return false;
      }
      console.error(e);
      alert("Username update failed");
      return false;
    }
  }

  // Email management
  const addEmail = useReverification((email: string) =>
    user!.createEmailAddress({ email })
  );
  const setPrimaryEmail = useReverification((id: string) =>
    user!.update({ primaryEmailAddressId: id })
  );
  const destroyEmail = useReverification((emailObj: any) => emailObj.destroy());
  async function handleEmailFlowFromPayload(payload: any): Promise<boolean> {
    if (!isLoaded || !user) return false;

    const desired = (payload?.email ?? "").trim(); // ค่าใหม่จากฟอร์ม (อาจเป็น "" ถ้ากด remove)
    const wantRemove = !!payload?.remove_email; // ธงจากฟอร์ม
    const currentPrimary = user.primaryEmailAddress?.emailAddress ?? "";
    const currentPrimaryId = user.primaryEmailAddress?.id ?? "";
    const all = user.emailAddresses ?? [];

    // ---- REMOVE ----
    if (wantRemove) {
      if (!currentPrimaryId) return true; // ไม่มีอยู่แล้ว
      try {
        // ถ้ามีอีเมลอื่น ให้สลับ primary ไปอันอื่นก่อน (ให้เลือก verified ก่อน)
        const others = all.filter((a) => a.id !== currentPrimaryId);
        if (others.length > 0) {
          const next =
            others.find((a) => a.verification?.status === "verified") ??
            others[0];
          await setPrimaryEmail(next.id);
        }
        // ลบอันเดิม
        await destroyEmail(user.primaryEmailAddress!);
        await user.reload();
        return true;
      } catch (e: any) {
        if (isClerkAPIResponseError(e)) {
          const msg = e.errors
            ?.map((er: any) => er.longMessage || er.message)
            .join("\n");
          alert(msg ?? "Failed to remove email");
          return false;
        }
        console.error(e);
        alert("Failed to remove email");
        return false;
      }
    }

    // ถ้าไม่ตั้งใจ remove:
    // - ถ้า desired ว่าง และไม่มี current → ถือว่า ok (ไม่มีอะไรทำ)
    // - ถ้า desired = current → ok
    if (!desired || desired === currentPrimary) return true;

    // ---- ADD or CHANGE ----
    if (!validateEmail(desired)) {
      alert("Invalid email format");
      return false;
    }

    try {
      // 1) สร้างอีเมลใหม่
      const created = await addEmail(desired);
      await user.reload();

      // หา object อีเมลที่เพิ่งสร้าง
      const after = user.emailAddresses ?? [];
      const emailObj =
        after.find((a) => a.id === created?.id) ||
        after.find((a) => a.emailAddress === desired);
      if (!emailObj) {
        alert("Email object not found after creation");
        return false;
      }

      // 2) ส่งโค้ดยืนยัน
      await emailObj.prepareVerification({ strategy: "email_code" });
      const code = window.prompt(`Enter the 6-digit code sent to ${desired}`);
      if (!code) {
        alert("Verification cancelled");
        return false;
      }
      const res = await emailObj.attemptVerification({ code });
      if (res?.verification?.status !== "verified") {
        alert("Verification failed");
        return false;
      }

      // 3) ตั้งเป็น primary
      await setPrimaryEmail(emailObj.id);

      // 4) (ออปชัน) ถ้าเป็นการเปลี่ยนจากอีเมลเก่า → ลบอีเมลเก่าออก
      if (currentPrimaryId) {
        const old = (user.emailAddresses ?? []).find(
          (a) => a.id === currentPrimaryId
        );
        if (old) {
          try {
            await destroyEmail(old);
          } catch {}
        }
      }

      await user.reload();
      return true;
    } catch (e: any) {
      if (isClerkAPIResponseError(e)) {
        const msg = e.errors
          ?.map((er: any) => er.longMessage || er.message)
          .join("\n");
        alert(msg ?? "Failed to add/verify email");
        return false;
      }
      console.error(e);
      alert("Failed to add/verify email");
      return false;
    }
  }

  // Password management
  const changePassword = useReverification(
    async (p: { newPassword: string }) => {
      if (!user) throw new Error("No user");
      return user.updatePassword({
        newPassword: p.newPassword,
        signOutOfOtherSessions: true,
      });
    }
  );

  function validatePwdPair(newPw: string, confirmPw: string) {
    if (!newPw && !confirmPw) return null; // ไม่ได้ตั้งใจเปลี่ยน
    if (!newPw || !confirmPw) return "Please fill both password fields";
    if (newPw.length < 8) return "Password must be at least 8 characters";
    if (newPw !== confirmPw) return "Passwords do not match";
    return null;
  }

  // Profile Image
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState<{
    file?: File;
    clear?: boolean;
  } | null>(null);
  const [imagePreviewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleAvatarClick = () => {
    if (tab !== "edit" || uploadingAvatar) return;
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingAvatar({ file, clear: false }); // แค่เก็บไว้ + แสดงพรีวิวได้
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleAvatarClear = () => {
    if (tab !== "edit") return;
    setConfirmClearOpen(true);
  };

  const handleAvatarClearConfirmed = () => {
    setPreviewUrl(null);
    setPendingAvatar({ clear: true });
    setConfirmClearOpen(false);
  };

  useEffect(() => {
    if (!isLoaded || !user || haveUserDb !== "ok") return;
    let abort = false;
    (async () => {
      try {
        const r = await getUserById(user.id);
        if (r) {
          console.log("Fetched user profile:", r);
          if (!abort) setProfile(r);
        }
      } catch {}
    })();
    return () => {
      abort = true;
    };
  }, [isLoaded, user, haveUserDb]);

  useEffect(() => {
    if (tab === "edit") {
      setPreviewUrl(user?.imageUrl ?? null);
    } else {
      setPreviewUrl(user?.imageUrl ?? null);
      null;
    }
  }, [tab, user?.imageUrl]);

  const handleEditSubmit = async (fd: FormData) => {
    if (!isLoaded || !user) return;

    const raw = fd.get("data");
    const data = raw ? JSON.parse(String(raw)) : {};
    const newUsername = data?.username as string | undefined;

    const newPw = String(fd.get("password_new") ?? "");
    const confirmPw = String(fd.get("password_confirm") ?? "");
    const pwErr = validatePwdPair(newPw, confirmPw);

    // const imageFile = pendingAvatar?.file ?? null;
    try {
      // Username
      if (newUsername && newUsername !== user.username) {
        const okU = await onSubmitUsername(newUsername);
        if (!okU) return; // ถ้า username ไม่ผ่าน validation หรืออัพเดตไม่สำเร็จ ให้หยุด
      }

      if (pwErr) {
        alert(pwErr);
        return;
      }

      // Password
      if (newPw) {
        try {
          await changePassword({ newPassword: newPw });
          await user.reload();
        } catch (e: any) {
          if (isClerkAPIResponseError(e)) {
            const msg = e.errors
              ?.map((er: any) => er.longMessage || er.message)
              .join("\n");
            alert(msg ?? "Password update failed");
            return; // ❗ ถ้าเปลี่ยน password ไม่สำเร็จ -> หยุดเลย ไม่อัปเดต DB
          }
          console.error(e);
          alert("Password update failed");
          return;
        }
      }

      // อย่าส่ง password ไป backend
      fd.delete("password_new");
      fd.delete("password_confirm");

      // Email
      const okE = await handleEmailFlowFromPayload(data);
      if (!okE) return; // ❗ ถ้าไม่ผ่าน -> ยกเลิก ไม่อัปเดต DB

      if (pendingAvatar?.file) {
        fd.append("image", pendingAvatar.file);
      }
      if (pendingAvatar?.clear) {
        const raw = fd.get("data");
        const data = raw ? JSON.parse(String(raw)) : {};
        data.remove_image = true;
        fd.set("data", JSON.stringify(data));
      }

      // User DB
      const ok = await updateUser(profile.id, fd);
      console.log("Submitting updated profile data:", data, fd);
      if (ok) {
        if (pendingAvatar?.file)
          await user.setProfileImage({ file: pendingAvatar.file });
        if (pendingAvatar?.clear) await user.setProfileImage({ file: null });
        await user.reload();
        const refreshed = await getUserById(user.id);
        setProfile(refreshed);

        router.replace(buildTabHref("profile"));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <SignedIn>
        <MuiBox
          sx={{
            p: { xs: 1, md: 4 },
            background: "#f3f4f6",
            minHeight: "100vh",
          }}
        >
          <Grid container spacing={2}>
            {/* Left rail */}
            <Grid size={{ xs: 12, md: 3, lg: 2.5 }}>
              <Paper
                sx={{
                  py: 4, // padding-top + padding-bottom = 32px (4 * 8px)
                  px: 2,
                  borderRadius: 3,
                }}
              >
                {/* Header area (avatar + actions) */}
                {tab === "edit" ? (
                  // ===== EDIT LAYOUT (avatar + buttons on the right) =====
                  <MuiBox
                    display="flex"
                    alignItems="center"
                    gap={2}
                    sx={{ mb: 2 }}
                  >
                    {/* ซ้าย: รูป + ชื่อ + อีเมล (กึ่งกลางใต้รูป) */}
                    <MuiBox
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <MuiBox
                        position="relative"
                        sx={{ width: 130, height: 130 }}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={handleAvatarFileChange}
                        />
                        <MuiBox
                          onClick={handleAvatarClick}
                          sx={{
                            position: "relative",
                            width: 130,
                            height: 130,
                            borderRadius: "50%",
                            overflow: "hidden",
                            cursor: "pointer",
                            "&:hover .hoverOverlay": { opacity: 1 },
                            transition: "transform 0.15s ease",
                            "&:hover": { transform: "scale(1.01)" },
                            boxShadow: uploadingAvatar ? 3 : 0,
                          }}
                        >
                          <Avatar
                            src={imagePreviewUrl ?? undefined}
                            alt={user?.fullName ?? "User"}
                            sx={{ width: "100%", height: "100%" }}
                          />
                          <MuiBox
                            className="hoverOverlay"
                            sx={{
                              position: "absolute",
                              inset: 0,
                              bgcolor: "rgba(0,0,0,0.25)",
                              opacity: 0,
                              transition: "opacity 0.2s ease",
                            }}
                          />

                          {uploadingAvatar && (
                            <MuiBox
                              sx={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "rgba(255,255,255,0.4)",
                              }}
                            >
                              <CircularProgress size={28} />
                            </MuiBox>
                          )}
                        </MuiBox>
                      </MuiBox>
                    </MuiBox>

                    {/* ขวา: ปุ่ม */}
                    <Stack spacing={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleAvatarClick}
                        disabled={uploadingAvatar}
                      >
                        Upload image
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        color="error"
                        onClick={handleAvatarClear}
                        disabled={uploadingAvatar}
                      >
                        Clear profile image
                      </Button>
                    </Stack>
                  </MuiBox>
                ) : (
                  // ===== SHOW LAYOUT (ปกติ: รูปซ้าย ข้อความขวา) =====
                  <MuiBox sx={{ mb: 2 }}>
                    <MuiBox
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Avatar
                        src={user?.imageUrl ?? undefined}
                        alt={user?.fullName ?? "User"}
                        sx={{ width: 130, height: 130 }}
                      />
                      <Typography mt={1} fontWeight={700} textAlign="center">
                        {user?.username ?? "—"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                      >
                        {user?.primaryEmailAddress?.emailAddress ?? ""}
                      </Typography>
                    </MuiBox>
                  </MuiBox>
                )}

                <Divider sx={{ my: 3 }} />

                <List>
                  <NavItem
                    href={buildTabHref("profile")}
                    icon={<PersonIcon />}
                    label="Profile"
                    active={isActiveTab(tab, "profile")}
                  />
                  <NavItem
                    href={buildTabHref("edit")}
                    icon={<EditIcon />}
                    label="Edit Profile"
                    active={isActiveTab(tab, "edit")}
                  />
                  <NavItem
                    href={buildTabHref("contributions")}
                    icon={<AssignmentTurnedInIcon />}
                    label="Contributions"
                    active={isActiveTab(tab, "contributions")}
                  />
                  <NavItem
                    href={buildTabHref("campaigns")}
                    icon={<DashboardCustomizeIcon />}
                    label="My Campaigns"
                    active={isActiveTab(tab, "campaigns")}
                  />
                </List>
              </Paper>
            </Grid>

            {/* Main content area (same page; only component changes) */}
            <Grid size={{ xs: 12, md: 9, lg: 9 }}>
              {tab === "profile" && <ProfilePanel />}
              {tab === "edit" && (
                <EditPanel onSubmit={handleEditSubmit} initial={profile} />
              )}
              {tab === "contributions" && <ContributionsPanel />}
              {tab === "campaigns" && <CampaignsPanel />}
            </Grid>
          </Grid>
        </MuiBox>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <Dialog
        open={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
      >
        <DialogTitle>ลบรูปโปรไฟล์?</DialogTitle>
        <DialogContent>คุณต้องการลบรูปโปรไฟล์ปัจจุบันหรือไม่</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmClearOpen(false)}>ยกเลิก</Button>
          <Button color="error" onClick={handleAvatarClearConfirmed}>
            ลบ
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function NavItem({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <ListItem disablePadding>
      <ListItemButton
        component={NextLink}
        href={href}
        selected={active}
        sx={{ borderRadius: 2, mb: 0.5 }}
      >
        <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
}
