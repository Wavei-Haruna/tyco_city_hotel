"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db, storage } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { toast } from "sonner";
import {
  Upload,
  X,
  Plus,
  Loader2,
  Image as ImageIcon,
  ArrowLeft,
  Check,
  Bed,
  Save,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AdminDashboardLayout from "@/app/admin/page";


interface EditRoomProps {
  roomId: string;
}

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

interface Room {
  name: string;
  price: number;
  description: string;
  rating: number;
  totalReviews: number;
  amenities: string[];
  status: "available" | "occupied" | "maintenance";
  images: string[];
}

export default function EditRoom({ roomId }: EditRoomProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "amenities",
  });

  useEffect(() => {
    if (roomId) {
      fetchRoomData();
    }
  }, [roomId]);

  const fetchRoomData = async () => {
    if (!roomId) return;

    try {
      const roomDoc = await getDoc(doc(db, "rooms", roomId));

      if (roomDoc.exists()) {
        const roomData = roomDoc.data() as Room;

        // Set existing images
        setExistingImages(roomData.images || []);

        // Reset form with existing data
        reset({
          name: roomData.name,
          price: roomData.price.toString(),
          description: roomData.description,
          rating: roomData.rating.toString(),
          totalReviews: roomData.totalReviews.toString(),
          status: roomData.status,
          amenities: roomData.amenities.map((name) => ({ name })),
        });
      } else {
        toast.error("Room not found");
        router.push("/admin/rooms");
      }
    } catch (error) {
      console.error("Error fetching room:", error);
      toast.error("Failed to load room data");
    } finally {
      setLoading(false);
    }
  };

  // Handle new image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length + newImages.length + files.length;

    if (totalImages > 4) {
      toast.error("You can only have up to 4 images total");
      return;
    }

    // Add new images
    setNewImages((prev) => [...prev, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove existing image
  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove new image
  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload new images to Firebase Storage
  const uploadNewImages = async (): Promise<string[]> => {
    const uploadPromises = newImages.map(async (image) => {
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
    const totalImages = existingImages.length + newImages.length;

    if (totalImages === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload new images
      const newImageUrls = await uploadNewImages();

      // Combine existing and new image URLs
      const allImageUrls = [...existingImages, ...newImageUrls];

      // Prepare update data
      const updateData = {
        name: data.name,
        price: parseFloat(data.price),
        description: data.description,
        rating: parseFloat(data.rating),
        totalReviews: parseInt(data.totalReviews),
        amenities: data.amenities.map((a) => a.name),
        status: data.status,
        images: allImageUrls,
        updatedAt: serverTimestamp(),
      };

      // Update in Firestore
      await updateDoc(doc(db, "rooms", roomId), updateData);

      toast.success("Room updated successfully!");
      router.push(`/admin/rooms/${roomId}`);
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("Failed to update room");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !roomId) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-tyco-red animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading room data...</p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-tyco-red transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          <h1 className="text-3xl font-bold text-tyco-navy mb-2">
            Edit Room
          </h1>
          <p className="text-gray-600">
            Update room information and details
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Image Management Section */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
            <h2 className="text-xl font-bold text-tyco-navy mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-tyco-red" />
              Room Images (Max 4)
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {/* Existing Images */}
              {existingImages.map((image, index) => (
                <div key={`existing-${index}`} className="relative group">
                  <img
                    src={image}
                    alt={`Room ${index + 1}`}
                    className="w-full h-32 object-cover rounded-xl border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-2 right-2 bg-tyco-red text-white p-1.5 rounded-lg
                             opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Existing
                  </div>
                </div>
              ))}

              {/* New Image Previews */}
              {newImagePreviews.map((preview, index) => (
                <div key={`new-${index}`} className="relative group">
                  <img
                    src={preview}
                    alt={`New ${index + 1}`}
                    className="w-full h-32 object-cover rounded-xl border-2 border-green-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-2 right-2 bg-tyco-red text-white p-1.5 rounded-lg
                             opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    New
                  </div>
                </div>
              ))}

              {/* Upload Button */}
              {(existingImages.length + newImages.length) < 4 && (
                <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl
                               flex flex-col items-center justify-center cursor-pointer
                               hover:border-tyco-red hover:bg-tyco-red/5 transition-all group">
                  <Upload className="w-6 h-6 text-gray-400 group-hover:text-tyco-red mb-2" />
                  <span className="text-sm text-gray-600 group-hover:text-tyco-red">
                    Add Image
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
              Total: {existingImages.length + newImages.length} / 4 images
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
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl
                       font-semibold hover:bg-gray-50 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-tyco-red to-tyco-accent
                       text-white rounded-xl font-semibold shadow-lg
                       hover:shadow-xl hover:-translate-y-0.5 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Update Room
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminDashboardLayout>
  );
}