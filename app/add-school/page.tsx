"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Upload, School } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const schoolSchema = z.object({
  name: z.string().min(2, "School name must be at least 2 characters"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  contact: z.string().regex(/^\+?[\d\s\-$$$$]{10,}$/, "Please enter a valid contact number"),
  email_id: z.string().email("Please enter a valid email address"),
  image: z.any().optional(),
})

type SchoolFormData = z.infer<typeof schoolSchema>

export default function AddSchoolPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: SchoolFormData) => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (key === "image" && value?.[0]) {
          formData.append(key, value[0])
        } else if (key !== "image") {
          formData.append(key, value as string)
        }
      })

      const response = await fetch("/api/schools", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to add school")
      }

      toast({
        title: "Success!",
        description: "School has been added successfully.",
      })

      reset()
      setImagePreview(null)
      router.push("/show-schools")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add school. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <School className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-3xl">Add New School</CardTitle>
            <CardDescription>Fill in the details below to register a new school</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">School Name *</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Enter school name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email_id">Email Address *</Label>
                  <Input
                    id="email_id"
                    type="email"
                    {...register("email_id")}
                    placeholder="school@example.com"
                    className={errors.email_id ? "border-red-500" : ""}
                  />
                  {errors.email_id && <p className="text-sm text-red-500">{errors.email_id.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  {...register("address")}
                  placeholder="Enter complete address"
                  className={errors.address ? "border-red-500" : ""}
                  rows={3}
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    {...register("city")}
                    placeholder="Enter city"
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    {...register("state")}
                    placeholder="Enter state"
                    className={errors.state ? "border-red-500" : ""}
                  />
                  {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number *</Label>
                <Input
                  id="contact"
                  {...register("contact")}
                  placeholder="+1 (555) 123-4567"
                  className={errors.contact ? "border-red-500" : ""}
                />
                {errors.contact && <p className="text-sm text-red-500">{errors.contact.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">School Image</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    {...register("image")}
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                  <Upload className="h-5 w-5 text-gray-400" />
                </div>
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Adding School..." : "Add School"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
