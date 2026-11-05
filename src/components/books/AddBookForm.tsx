// "use client";

// import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
// import Image from "next/image";
// import {
//   BookPlus,
//   BookOpen,
//   ImagePlus,
//   Loader2,
//   CheckCircle2,
//   X,
//   LibraryBig,
//   Upload,
// } from "lucide-react";
// import { toast } from "sonner";

// import {
//   addBookSchema,
//   bookCategories,
//   type AddBookValues,
// } from "@/lib/validations/book";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { addBook } from "@/lib/book-api";

// type FormErrors = Partial<Record<keyof AddBookValues, string>>;

// interface AddBookFormProps {
//   userName: string;
//   userEmail: string;
// }

// const MAX_FILE_SIZE = 5 * 1024 * 1024;

// const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// const initialForm = {
//   title: "",
//   author: "",
//   category: "",
//   totalCopies: "",
//   description: "",
// };

// // SHARED STYLES FOR CONSISTENT INPUT DESIGN
// const fieldStyle = `
//   !h-12 w-full rounded-xl
//   border border-[#dce5da]
//   bg-[#fcfdfa] px-4
//   text-sm text-[#263d2e]
//   shadow-none
//   transition-all duration-200
//   hover:border-[#b8cdb9]
//   focus-visible:border-[#1d513b]
//   focus-visible:ring-2
//   focus-visible:ring-[#1d513b]/15
//   aria-invalid:border-red-500
//   aria-invalid:ring-red-500/10
// `;

// const labelStyle = "text-sm font-medium text-[#263d2e]";

// const errorStyle = "text-xs text-red-600";

// export default function AddBookForm({ userName, userEmail }: AddBookFormProps) {
//   const [form, setForm] = useState(initialForm);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [loading, setLoading] = useState(false);

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [imageError, setImageError] = useState("");

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // HANDLE INPUT CHANGES
//   const handleChange = (field: keyof typeof initialForm, value: string) => {
//     setForm((prev) => ({
//       ...prev,
//       [field]: value,
//     }));

//     setErrors((prev) => ({
//       ...prev,
//       [field]: undefined,
//     }));
//   };

//   // HANDLE IMAGE SELECTION
//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];

//     if (!file) return;

//     e.target.value = "";

//     if (!ALLOWED_TYPES.includes(file.type)) {
//       setImageError("Please select a JPG, PNG, or WebP image");
//       toast.error("Invalid image format");
//       return;
//     }

//     if (file.size > MAX_FILE_SIZE) {
//       setImageError("Image must be 5 MB or smaller");
//       toast.error("Image must be 5 MB or smaller");
//       return;
//     }

//     const reader = new FileReader();

//     reader.onload = () => {
//       if (typeof reader.result === "string") {
//         setSelectedFile(file);
//         setPreview(reader.result);
//         setImageError("");
//       }
//     };

//     reader.onerror = () => {
//       setImageError("Could not preview the selected image");
//       toast.error("Could not preview the selected image");
//     };

//     reader.readAsDataURL(file);
//   };

//   // REMOVE IMAGE
//   const handleRemoveImage = () => {
//     setSelectedFile(null);
//     setPreview(null);
//     setImageError("");

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   // HANDLE FORM SUBMISSION
//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (loading) return;

//     // VALIDATE ALL TEXT FIELDS
//     const validation = addBookSchema.omit({ image: true }).safeParse({
//       ...form,
//       totalCopies:
//         form.totalCopies.trim() === "" ? 0 : Number(form.totalCopies),
//     });

//     if (!validation.success) {
//       const fieldErrors: FormErrors = {};

//       validation.error.issues.forEach((issue) => {
//         const field = issue.path[0] as keyof AddBookValues;

//         if (!fieldErrors[field]) {
//           fieldErrors[field] = issue.message;
//         }
//       });

//       setErrors(fieldErrors);
//       toast.error("Please correct the form errors");
//       return;
//     }

//     setErrors({});

//     // VALIDATE IMAGE
//     if (!selectedFile) {
//       setImageError("Please select a book cover image");
//       toast.error("Please select a book cover image");
//       return;
//     }

//     setImageError("");

//     const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//     if (!apiUrl) {
//       toast.error("Backend API URL is not configured");
//       return;
//     }

//     setLoading(true);

//     try {
//       // STEP 1: UPLOAD IMAGE TO IMGBB
//       const imageFormData = new FormData();
//       imageFormData.append("image", selectedFile);

//       const uploadResponse = await fetch("/api/upload-profile", {
//         method: "POST",
//         body: imageFormData,
//       });

//       const uploadResult = await uploadResponse.json();

//       if (
//         !uploadResponse.ok ||
//         typeof uploadResult.url !== "string" ||
//         !uploadResult.url
//       ) {
//         throw new Error(uploadResult.error || "Book image upload failed");
//       }

//       // STEP 2: PREPARE COMPLETE BOOK DATA
//       const bookData = addBookSchema.parse({
//         ...validation.data,
//         image: uploadResult.url,
//       });

//       const newBook = {
//         ...bookData,
//         userName,
//         userEmail,
//       };

//       // STEP 3: SEND POST REQUEST TO EXPRESS
//       const response = await fetch(`${apiUrl.replace(/\/$/, "")}/add-book`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newBook),
//       });

//       const responseText = await response.text();

//       let result: {
//         success?: boolean;
//         message?: string;
//         insertedId?: string;
//       };

//       try {
//         result = JSON.parse(responseText);
//       } catch {
//         console.error("Non-JSON backend response:", responseText);

//         throw new Error(`Invalid backend response (HTTP ${response.status})`);
//       }

//       if (!response.ok || !result.success) {
//         throw new Error(result.message || "Failed to add book");
//       }

//       // STEP 4: SUCCESS
//       toast.success("Book added successfully!");

//       // STEP 5: RESET FORM
//       setForm(initialForm);
//       handleRemoveImage();
//       setErrors({});
//     } catch (error) {
//       console.error("Add book error:", error);

//       toast.error(
//         error instanceof Error
//           ? error.message
//           : "Something went wrong. Please try again.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card className="mx-auto w-full min-w-0 max-w-full gap-0 overflow-hidden rounded-3xl border border-[#e1e8df] bg-white py-0 shadow-sm">
//       {/* CARD HEADER */}
//       <CardHeader className="border-b border-[#edf0e9] bg-[#f9fbf7] px-6 py-7 sm:px-9">
//         <div className="flex items-center gap-4">
//           <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#e4efe5] text-[#1d513b]">
//             <BookOpen size={24} />
//           </div>

//           <div className="space-y-1">
//             <CardTitle className="font-serif text-2xl font-semibold text-[#1b3326]">
//               Book Information
//             </CardTitle>

//             <CardDescription className="text-sm text-[#718075]">
//               Fill in the details to add a new book to the library.
//             </CardDescription>
//           </div>
//         </div>
//       </CardHeader>

//       <CardContent className="px-6 py-8 sm:px-9">
//         <form onSubmit={handleSubmit} noValidate className="w-full min-w-0 space-y-7">
//           {/* BOOK TITLE AND AUTHOR */}
//           <div className="grid gap-5 sm:grid-cols-2">
//             <div className="space-y-2">
//               <Label htmlFor="title" className={labelStyle}>
//                 Book Title <span className="text-red-500">*</span>
//               </Label>

//               <Input
//                 id="title"
//                 name="title"
//                 required
//                 placeholder="Enter book title"
//                 value={form.title}
//                 onChange={(e) => handleChange("title", e.target.value)}
//                 aria-invalid={!!errors.title}
//                 className={fieldStyle}
//               />

//               {errors.title && <p className={errorStyle}>{errors.title}</p>}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="author" className={labelStyle}>
//                 Author Name <span className="text-red-500">*</span>
//               </Label>

//               <Input
//                 id="author"
//                 name="author"
//                 required
//                 placeholder="Enter author name"
//                 value={form.author}
//                 onChange={(e) => handleChange("author", e.target.value)}
//                 aria-invalid={!!errors.author}
//                 className={fieldStyle}
//               />

//               {errors.author && <p className={errorStyle}>{errors.author}</p>}
//             </div>
//           </div>

//           {/* CATEGORY AND TOTAL COPIES */}
//           <div className="grid gap-5 sm:grid-cols-2">
//             <div className="space-y-2">
//               <Label htmlFor="category" className={labelStyle}>
//                 Category <span className="text-red-500">*</span>
//               </Label>

//               <Select
//                 value={form.category}
//                 onValueChange={(value) => handleChange("category", value ?? "")}
//               >
//                 <SelectTrigger
//                   id="category"
//                   aria-invalid={!!errors.category}
//                   className={`${fieldStyle} [&>svg]:size-4 [&>svg]:text-[#748177]`}
//                 >
//                   <SelectValue placeholder="Select a category" />
//                 </SelectTrigger>

//                 <SelectContent className="rounded-xl border border-[#dce5da] bg-white p-1.5 shadow-lg">
//                   {bookCategories.map((category) => (
//                     <SelectItem
//                       key={category}
//                       value={category}
//                       className="cursor-pointer rounded-lg px-3 py-2.5 text-sm text-[#263d2e] focus:bg-[#e9f2e8] focus:text-[#1d513b] data-[state=checked]:font-medium data-[state=checked]:text-[#1d513b]"
//                     >
//                       {category}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               {errors.category && (
//                 <p className={errorStyle}>{errors.category}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="totalCopies" className={labelStyle}>
//                 Total Copies <span className="text-red-500">*</span>
//               </Label>

//               <Input
//                 id="totalCopies"
//                 name="totalCopies"
//                 type="number"
//                 min={1}
//                 step={1}
//                 required
//                 placeholder="e.g. 4"
//                 value={form.totalCopies}
//                 onChange={(e) => handleChange("totalCopies", e.target.value)}
//                 aria-invalid={!!errors.totalCopies}
//                 className={fieldStyle}
//               />

//               {errors.totalCopies && (
//                 <p className={errorStyle}>{errors.totalCopies}</p>
//               )}
//             </div>
//           </div>

//           {/* BOOK COVER */}
//           <div className="space-y-2">
//             <Label htmlFor="bookImage" className={labelStyle}>
//               Book Cover <span className="text-red-500">*</span>
//             </Label>

//             <Input
//               ref={fileInputRef}
//               id="bookImage"
//               name="bookImage"
//               type="file"
//               accept="image/jpeg,image/png,image/webp"
//               onChange={handleImageChange}
//               aria-invalid={!!imageError}
//               className="sr-only"
//             />

//             {preview ? (
//               <div className="flex flex-col gap-5 rounded-2xl border border-[#dce5da] bg-[#f9fbf8] p-5 sm:flex-row sm:items-center">
//                 <div className="relative h-44 w-32 shrink-0 overflow-hidden rounded-xl border border-[#dce5da] bg-white">
//                   <Image
//                     src={preview}
//                     alt="Book cover preview"
//                     fill
//                     unoptimized
//                     sizes="128px"
//                     className="object-contain"
//                   />
//                 </div>

//                 <div className="min-w-0 flex-1 space-y-3">
//                   <div className="flex items-center gap-2 text-[#1d513b]">
//                     <CheckCircle2 size={17} />
//                     <span className="text-sm font-medium">
//                       Cover image selected
//                     </span>
//                   </div>

//                   <p className="break-all text-sm text-[#748177]">
//                     {selectedFile?.name}
//                   </p>

//                   <div className="flex flex-wrap gap-2">
//                     <Button
//                       type="button"
//                       variant="outline"
//                       disabled={loading}
//                       onClick={() => fileInputRef.current?.click()}
//                       className="rounded-lg border-[#cbd9ca] text-[#1d513b] hover:bg-[#eaf2e8]"
//                     >
//                       <Upload className="size-4" />
//                       Change Image
//                     </Button>

//                     <Button
//                       type="button"
//                       variant="ghost"
//                       disabled={loading}
//                       onClick={handleRemoveImage}
//                       className="text-red-600 hover:bg-red-50 hover:text-red-700"
//                     >
//                       <X className="size-4" />
//                       Remove
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <Button
//                 type="button"
//                 variant="outline"
//                 disabled={loading}
//                 onClick={() => fileInputRef.current?.click()}
//                 className="flex h-auto w-full flex-col gap-3 rounded-2xl border-2 border-dashed border-[#cadac9] bg-[#f9fbf8] px-5 py-10 text-center whitespace-normal shadow-none transition hover:border-[#7fa58a] hover:bg-[#f1f7ef]"
//               >
//                 <span className="flex size-12 items-center justify-center rounded-xl bg-[#e5f0e5] text-[#1d513b]">
//                   <ImagePlus size={24} />
//                 </span>

//                 <span className="text-sm font-semibold text-[#294532]">
//                   Click to upload book cover
//                 </span>

//                 <span className="text-xs font-normal text-[#8a988d]">
//                   JPG, PNG or WebP · Maximum 5 MB
//                 </span>
//               </Button>
//             )}

//             {imageError && <p className={errorStyle}>{imageError}</p>}
//           </div>

//           {/* DESCRIPTION */}
//           <div className="space-y-2">
//             <Label htmlFor="description" className={labelStyle}>
//               Short Description <span className="text-red-500">*</span>
//             </Label>

//             <Textarea
//               id="description"
//               name="description"
//               rows={5}
//               maxLength={2000}
//               required
//               placeholder="Write a short description of the book..."
//               value={form.description}
//               onChange={(e) => handleChange("description", e.target.value)}
//               aria-invalid={!!errors.description}
//               className="min-h-32 resize-y rounded-xl border-[#dce5da] bg-[#fcfdfa] px-4 py-3 text-sm text-[#263d2e] shadow-none focus-visible:border-[#1d513b] focus-visible:ring-[#1d513b]/15"
//             />

//             <div className="flex justify-between gap-3">
//               {errors.description ? (
//                 <p className={errorStyle}>{errors.description}</p>
//               ) : (
//                 <p className="text-xs text-[#89968b]">
//                   A brief summary helps readers discover your book.
//                 </p>
//               )}

//               <span className="text-xs text-[#89968b]">
//                 {form.description.length}/2000
//               </span>
//             </div>
//           </div>

//           {/* USER DETAILS */}
//           <div className="rounded-2xl border border-[#e0e9de] bg-[#f5f9f3] p-5">
//             <div className="mb-5 flex items-center gap-2">
//               <LibraryBig size={18} className="text-[#1d513b]" />

//               <h3 className="text-sm font-semibold text-[#1d513b]">Added By</h3>
//             </div>

//             <div className="grid gap-5 sm:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="userName" className={labelStyle}>
//                   User Name
//                 </Label>

//                 <Input
//                   id="userName"
//                   value={userName}
//                   readOnly
//                   className={`${fieldStyle} cursor-not-allowed bg-[#edf2eb] text-[#637368]`}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="userEmail" className={labelStyle}>
//                   User Email
//                 </Label>

//                 <Input
//                   id="userEmail"
//                   type="email"
//                   value={userEmail}
//                   readOnly
//                   className={`${fieldStyle} cursor-not-allowed bg-[#edf2eb] text-[#637368]`}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* SUBMIT BUTTON */}
//           <Button
//             type="submit"
//             disabled={loading}
//             className="!h-12 w-full rounded-xl bg-[#1d513b] text-sm font-semibold text-white shadow-sm transition hover:bg-[#153e2c] disabled:opacity-60"
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="size-4 animate-spin" />
//                 Adding Book...
//               </>
//             ) : (
//               <>
//                 <BookPlus className="size-4" />
//                 Add Book
//               </>
//             )}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import {
  BookPlus,
  BookOpen,
  ImagePlus,
  Loader2,
  CheckCircle2,
  X,
  LibraryBig,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import {
  addBookSchema,
  bookCategories,
  type AddBookValues,
} from "@/lib/validations/book";

import { addBook } from "@/lib/book-api";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormErrors = Partial<Record<keyof AddBookValues, string>>;

interface AddBookFormProps {
  userName: string;
  userEmail: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const initialForm = {
  title: "",
  author: "",
  category: "",
  totalCopies: "",
  description: "",
};

const fieldStyle = `
  !h-12 w-full rounded-xl
  border border-[#dce5da]
  bg-[#fcfdfa] px-4
  text-sm text-[#263d2e]
  shadow-none
  transition-all duration-200
  hover:border-[#b8cdb9]
  focus-visible:border-[#1d513b]
  focus-visible:ring-2
  focus-visible:ring-[#1d513b]/15
  aria-invalid:border-red-500
  aria-invalid:ring-red-500/10
`;

const labelStyle = "text-sm font-medium text-[#263d2e]";

const errorStyle = "text-xs text-red-600";

export default function AddBookForm({ userName, userEmail }: AddBookFormProps) {
  const [form, setForm] = useState(initialForm);

  const [errors, setErrors] = useState<FormErrors>({});

  const [loading, setLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [preview, setPreview] = useState<string | null>(null);

  const [imageError, setImageError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // HANDLE INPUT CHANGES
  const handleChange = (field: keyof typeof initialForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  // HANDLE IMAGE SELECTION
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    e.target.value = "";

    if (!ALLOWED_TYPES.includes(file.type)) {
      setImageError("Please select a JPG, PNG, or WebP image");
      toast.error("Invalid image format");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setImageError("Image must be 5 MB or smaller");
      toast.error("Image must be 5 MB or smaller");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSelectedFile(file);
        setPreview(reader.result);
        setImageError("");
      }
    };

    reader.onerror = () => {
      setImageError("Could not preview the selected image");
      toast.error("Could not preview the selected image");
    };

    reader.readAsDataURL(file);
  };

  // REMOVE IMAGE
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreview(null);
    setImageError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // HANDLE FORM SUBMISSION
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    // STEP 1: VALIDATE TEXT FIELDS
    const validation = addBookSchema.omit({ image: true }).safeParse({
      ...form,
      totalCopies:
        form.totalCopies.trim() === "" ? 0 : Number(form.totalCopies),
    });

    if (!validation.success) {
      const fieldErrors: FormErrors = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof AddBookValues;

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      toast.error("Please correct the form errors");
      return;
    }

    setErrors({});

    // STEP 2: VALIDATE IMAGE
    if (!selectedFile) {
      setImageError("Please select a book cover image");
      toast.error("Please select a book cover image");
      return;
    }

    setImageError("");
    setLoading(true);

    try {
      // STEP 3: UPLOAD IMAGE TO IMGBB
      const imageFormData = new FormData();

      imageFormData.append("image", selectedFile);

      // This is your Next.js upload endpoint,
      // so it does not use apiFetch().
      const uploadResponse = await fetch("/api/upload-profile", {
        method: "POST",
        body: imageFormData,
      });

      const uploadResult = await uploadResponse.json();

      if (
        !uploadResponse.ok ||
        typeof uploadResult.url !== "string" ||
        !uploadResult.url
      ) {
        throw new Error(uploadResult.error || "Book image upload failed");
      }

      // STEP 4: PREPARE AND VALIDATE BOOK DATA
      const bookData = addBookSchema.parse({
        ...validation.data,
        image: uploadResult.url,
      });

      // STEP 5: SEND AUTHENTICATED REQUEST TO EXPRESS
      // addBook() uses apiFetch() internally,
      // which attaches Authorization: Bearer <JWT>.
      //
      // No userName or userEmail is sent here.
      // The Express backend gets the user's
      // identity from the verified JWT.
      const result = await addBook(bookData);

      // STEP 6: SUCCESS
      toast.success(result.message || "Book added successfully!");

      // STEP 7: RESET FORM
      setForm(initialForm);
      handleRemoveImage();
      setErrors({});
    } catch (error) {
      console.error("Add book error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full min-w-0 max-w-full gap-0 overflow-hidden rounded-3xl border border-[#e1e8df] bg-white py-0 shadow-sm">
      {/* CARD HEADER */}
      <CardHeader className="border-b border-[#edf0e9] bg-[#f9fbf7] px-6 py-7 sm:px-9">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#e4efe5] text-[#1d513b]">
            <BookOpen size={24} />
          </div>

          <div className="space-y-1">
            <CardTitle className="font-serif text-2xl font-semibold text-[#1b3326]">
              Book Information
            </CardTitle>

            <CardDescription className="text-sm text-[#718075]">
              Fill in the details to add a new book to the library.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 py-8 sm:px-9">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="w-full min-w-0 space-y-7"
        >
          {/* BOOK TITLE AND AUTHOR */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title" className={labelStyle}>
                Book Title <span className="text-red-500">*</span>
              </Label>

              <Input
                id="title"
                name="title"
                required
                placeholder="Enter book title"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                aria-invalid={!!errors.title}
                className={fieldStyle}
              />

              {errors.title && <p className={errorStyle}>{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="author" className={labelStyle}>
                Author Name <span className="text-red-500">*</span>
              </Label>

              <Input
                id="author"
                name="author"
                required
                placeholder="Enter author name"
                value={form.author}
                onChange={(e) => handleChange("author", e.target.value)}
                aria-invalid={!!errors.author}
                className={fieldStyle}
              />

              {errors.author && <p className={errorStyle}>{errors.author}</p>}
            </div>
          </div>

          {/* CATEGORY AND TOTAL COPIES */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category" className={labelStyle}>
                Category <span className="text-red-500">*</span>
              </Label>

              <Select
                value={form.category}
                onValueChange={(value) => handleChange("category", value ?? "")}
              >
                <SelectTrigger
                  id="category"
                  aria-invalid={!!errors.category}
                  className={`${fieldStyle} [&>svg]:size-4 [&>svg]:text-[#748177]`}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>

                <SelectContent className="rounded-xl border border-[#dce5da] bg-white p-1.5 shadow-lg">
                  {bookCategories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="cursor-pointer rounded-lg px-3 py-2.5 text-sm text-[#263d2e] focus:bg-[#e9f2e8] focus:text-[#1d513b] data-[state=checked]:font-medium data-[state=checked]:text-[#1d513b]"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.category && (
                <p className={errorStyle}>{errors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalCopies" className={labelStyle}>
                Total Copies <span className="text-red-500">*</span>
              </Label>

              <Input
                id="totalCopies"
                name="totalCopies"
                type="number"
                min={1}
                step={1}
                required
                placeholder="e.g. 4"
                value={form.totalCopies}
                onChange={(e) => handleChange("totalCopies", e.target.value)}
                aria-invalid={!!errors.totalCopies}
                className={fieldStyle}
              />

              {errors.totalCopies && (
                <p className={errorStyle}>{errors.totalCopies}</p>
              )}
            </div>
          </div>

          {/* BOOK COVER */}
          <div className="space-y-2">
            <Label htmlFor="bookImage" className={labelStyle}>
              Book Cover <span className="text-red-500">*</span>
            </Label>

            <Input
              ref={fileInputRef}
              id="bookImage"
              name="bookImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              aria-invalid={!!imageError}
              className="sr-only"
            />

            {preview ? (
              <div className="flex flex-col gap-5 rounded-2xl border border-[#dce5da] bg-[#f9fbf8] p-5 sm:flex-row sm:items-center">
                <div className="relative h-44 w-32 shrink-0 overflow-hidden rounded-xl border border-[#dce5da] bg-white">
                  <Image
                    src={preview}
                    alt="Book cover preview"
                    fill
                    unoptimized
                    sizes="128px"
                    className="object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-[#1d513b]">
                    <CheckCircle2 size={17} />

                    <span className="text-sm font-medium">
                      Cover image selected
                    </span>
                  </div>

                  <p className="break-all text-sm text-[#748177]">
                    {selectedFile?.name}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={loading}
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg border-[#cbd9ca] text-[#1d513b] hover:bg-[#eaf2e8]"
                    >
                      <Upload className="size-4" />
                      Change Image
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      disabled={loading}
                      onClick={handleRemoveImage}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <X className="size-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => fileInputRef.current?.click()}
                className="flex h-auto w-full flex-col gap-3 rounded-2xl border-2 border-dashed border-[#cadac9] bg-[#f9fbf8] px-5 py-10 text-center whitespace-normal shadow-none transition hover:border-[#7fa58a] hover:bg-[#f1f7ef]"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-[#e5f0e5] text-[#1d513b]">
                  <ImagePlus size={24} />
                </span>

                <span className="text-sm font-semibold text-[#294532]">
                  Click to upload book cover
                </span>

                <span className="text-xs font-normal text-[#8a988d]">
                  JPG, PNG or WebP · Maximum 5 MB
                </span>
              </Button>
            )}

            {imageError && <p className={errorStyle}>{imageError}</p>}
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label htmlFor="description" className={labelStyle}>
              Short Description <span className="text-red-500">*</span>
            </Label>

            <Textarea
              id="description"
              name="description"
              rows={5}
              maxLength={2000}
              required
              placeholder="Write a short description of the book..."
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              aria-invalid={!!errors.description}
              className="min-h-32 resize-y rounded-xl border-[#dce5da] bg-[#fcfdfa] px-4 py-3 text-sm text-[#263d2e] shadow-none focus-visible:border-[#1d513b] focus-visible:ring-[#1d513b]/15"
            />

            <div className="flex justify-between gap-3">
              {errors.description ? (
                <p className={errorStyle}>{errors.description}</p>
              ) : (
                <p className="text-xs text-[#89968b]">
                  A brief summary helps readers discover your book.
                </p>
              )}

              <span className="text-xs text-[#89968b]">
                {form.description.length}/2000
              </span>
            </div>
          </div>

          {/* USER DETAILS */}
          <div className="rounded-2xl border border-[#e0e9de] bg-[#f5f9f3] p-5">
            <div className="mb-5 flex items-center gap-2">
              <LibraryBig size={18} className="text-[#1d513b]" />

              <h3 className="text-sm font-semibold text-[#1d513b]">Added By</h3>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="userName" className={labelStyle}>
                  User Name
                </Label>

                <Input
                  id="userName"
                  value={userName}
                  readOnly
                  className={`${fieldStyle} cursor-not-allowed bg-[#edf2eb] text-[#637368]`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userEmail" className={labelStyle}>
                  User Email
                </Label>

                <Input
                  id="userEmail"
                  type="email"
                  value={userEmail}
                  readOnly
                  className={`${fieldStyle} cursor-not-allowed bg-[#edf2eb] text-[#637368]`}
                />
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            disabled={loading}
            className="!h-12 w-full rounded-xl bg-[#1d513b] text-sm font-semibold text-white shadow-sm transition hover:bg-[#153e2c] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Adding Book...
              </>
            ) : (
              <>
                <BookPlus className="size-4" />
                Add Book
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
