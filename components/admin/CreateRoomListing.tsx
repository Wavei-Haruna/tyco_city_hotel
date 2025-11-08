"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";
import {
  Upload,
  X,
  Plus,
  Loader2,
  Image as ImageIcon,
  Star,
  Bed,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AdminDashboardLayout from "@/app/admin/page";

// Validation Schema
const roomSchema = z.object({
  name: z.string().min(3, "Room name must be at least 3 characters"),
  price: z.string().min(1, "Price is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  rating: z.string().min(1, "Rating is required"),
  totalReviews: z.string().min(1, "Total reviews is required"),
  amenities: z.array(
    z.object({
      name: z.string().min(1, "Amenity name is required"),
    })
  ).min(1, "At least one amenity is required"),
  status: z.enum(["available", "occupied", "maintenance"]),
});

type RoomFormData = z.infer<typeof roomSchema>;

export default function CreateRoomListing() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      amenities: [{ name: "" }],
      status: "available",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "amenities",
  });

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (images.length + files.length > 4) {
      toast.error("You can only upload up to 4 images");
      return;
    }

    // Add new images
    setImages((prev) => [...prev, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload images to Firebase Storage
  const uploadImages = async (): Promise<string[]> => {
    const uploadPromises = images.map(async (image) => {
      const storageRef = ref(
        storage,
        `rooms/${Date.now()}-${image.name}`
      );
      await uploadBytes(storageRef, image);
      return getDownloadURL(storageRef);
    });

    return Promise.all(uploadPromises);
  };

  // Submit form
  const onSubmit = async (data: RoomFormData) => {
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsLoading(true);

    try {
      // Upload images
      const imageUrls = await uploadImages();

      // Prepare room data
      const roomData = {
        name: data.name,
        price: parseFloat(data.price),
        description: data.description,
        rating: parseFloat(data.rating),
        totalReviews: parseInt(data.totalReviews),
        amenities: data.amenities.map((a) => a.name),
        status: data.status,
        images: imageUrls,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Add to Firestore
      await addDoc(collection(db, "rooms"), roomData);

      toast.success("Room listing created successfully!");
      reset();
      setImages([]);
      setImagePreviews([]);
      router.push("/admin/rooms");
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room listing");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-tyco-navy mb-2">
            Create New Room Listing
          </h1>
          <p className="text-gray-600">
            Add a new room to your hotel inventory
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Image Upload Section */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
            <h2 className="text-xl font-bold text-tyco-navy mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-tyco-red" />
              Room Images (Max 4)
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-xl border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-tyco-red text-white p-1.5 rounded-lg
                             opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {images.length < 4 && (
                <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl
                               flex flex-col items-center justify-center cursor-pointer
                               hover:border-tyco-red hover:bg-tyco-red/5 transition-all group">
                  <Upload className="w-6 h-6 text-gray-400 group-hover:text-tyco-red mb-2" />
                  <span className="text-sm text-gray-600 group-hover:text-tyco-red">
                    Upload Image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    multiple
                  />
                </label>
              )}
            </div>

            <p className="text-sm text-gray-500">
              Upload up to 4 high-quality images of the room
            </p>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
            <h2 className="text-xl font-bold text-tyco-navy mb-6 flex items-center gap-2">
              <Bed className="w-5 h-5 text-tyco-red" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Room Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-tyco-navy mb-2">
                  Room Name *
                </label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="e.g., Deluxe Room, Executive Suite"
                  className="input"
                />
                {errors.name && (
                  <p className="text-tyco-red text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-tyco-navy mb-2">
                  Price per Night (GH₵) *
                </label>
                <input
                  {...register("price")}
                  type="number"
                  step="0.01"
                  placeholder="299"
                  className="input"
                />
                {errors.price && (
                  <p className="text-tyco-red text-xs mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-tyco-navy mb-2">
                  Room Status *
                </label>
                <select {...register("status")} className="input">
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-tyco-navy mb-2">
                  Rating (0-5) *
                </label>
                <input
                  {...register("rating")}
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="4.8"
                  className="input"
                />
                {errors.rating && (
                  <p className="text-tyco-red text-xs mt-1">
                    {errors.rating.message}
                  </p>
                )}
              </div>

              {/* Total Reviews */}
              <div>
                <label className="block text-sm font-semibold text-tyco-navy mb-2">
                  Total Reviews *
                </label>
                <input
                  {...register("totalReviews")}
                  type="number"
                  placeholder="245"
                  className="input"
                />
                {errors.totalReviews && (
                  <p className="text-tyco-red text-xs mt-1">
                    {errors.totalReviews.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-tyco-navy mb-2">
                  Description *
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Describe the room features, size, and what makes it special..."
                  className="input resize-none"
                />
                {errors.description && (
                  <p className="text-tyco-red text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-tyco-navy flex items-center gap-2">
                <Check className="w-5 h-5 text-tyco-red" />
                Room Amenities
              </h2>
              <button
                type="button"
                onClick={() => append({ name: "" })}
                className="flex items-center gap-2 px-4 py-2 bg-tyco-red text-white rounded-xl
                         hover:bg-tyco-accent transition-all text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                Add Amenity
              </button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3">
                  <input
                    {...register(`amenities.${index}.name`)}
                    type="text"
                    placeholder="e.g., King Bed, City View, Free WiFi"
                    className="input flex-1"
                  />
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl
                               hover:bg-red-50 hover:text-tyco-red transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {errors.amenities && (
              <p className="text-tyco-red text-xs mt-2">
                {errors.amenities.message}
              </p>
            )}

            <div className="mt-4 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Add amenities like "King Bed", "City View",
                "Marble Bathroom", "Free WiFi", etc.
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isLoading}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl
                       font-semibold hover:bg-gray-50 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-tyco-red to-tyco-accent
                       text-white rounded-xl font-semibold shadow-lg
                       hover:shadow-xl hover:-translate-y-0.5 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Room Listing
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminDashboardLayout>
  );
}