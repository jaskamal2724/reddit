"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createCommunity } from "@/lib/actions/community-actions"

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Community name must be at least 3 characters" })
    .max(21, { message: "Community name must be less than 21 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Community name can only contain letters, numbers, and underscores",
    }),
})

export default function CreateCommunityForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError(null)

    try {
      const slug = values.name.toLowerCase()
      const result = await createCommunity({
        name: values.name,
        slug,
      })

      if (result.success) {
        router.push(`/r/${slug}`)
        router.refresh()
      } else {
        setError(result.error || "Failed to create community")
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Community Name</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">r/</span>
                  <Input {...field} />
                </div>
              </FormControl>
              <FormDescription>Community names cannot be changed once created.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Community"}
        </Button>
      </form>
    </Form>
  )
}
