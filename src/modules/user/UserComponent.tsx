// "use client";

// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { createUser } from "./api/api";
// import UserForm from "./components/UserForm";

// export default function UserComponent() {
//   const { uaser, isLoaded } = useUser();
//   const router = useRouter();

//   const handleSubmit = async (data: any, file?: File | null) => {
//     if (!user) return;

//     const payload = {
//       ...data,
//       clerk_id: user.id,
//       email:
//         user.primaryEmailAddress?.emailAddress ??
//         user.emailAddresses?.[0]?.emailAddress ??
//         null, // อย่าส่ง "" ให้ EmailStr
//       username: user.username || user.id,
//     };
//     console.log("submit payload:", payload);

//     const result = await createUser(payload);
//     if (!result) {
//       console.error("Create user failed");
//       return;
//     }
//     console.log("User created successfully: ", user.id);

//     if (file) {
//       console.log("Handling file upload...");
//       const fd = new FormData();
//       fd.append("file", file);
//       fd.append("clerk_id", user.id);
//       // ปรับให้ตรงกับ API ของคุณ เช่น /api/image/upload?user_id=...
//       const res = await fetch("http://localhost:8000/api/image/upload", {
//         method: "POST",
//         body: fd,
//         // ถ้า backend ต้องรู้ user ที่จะผูก: ส่ง header/param เพิ่มตามที่คุณกำหนด
//       });
//       if (!res.ok) {
//         console.error("Upload image failed");
//         // ไม่ต้อง block flow ถ้ารูปไม่จำเป็น
//       }
//       else {
//         console.log("Image uploaded successfully");
//       }
//     }
//   };

//   if (isLoaded && !user) router.push("/");

//   return (
//     <div className="max-w-lg mx-auto mt-10">
//       <h1 className="text-2xl font-bold mb-4">Setup your profile</h1>
//       <UserForm onSubmit={handleSubmit} />
//     </div>
//   );
// }
