"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { 
  FileText, 
  Image, 
  Link as LinkIcon, 
  Video, 
  ChevronDown,
  Search,
  Plus,
  X,
  Upload,
  Eye,
  AlertCircle,
  Hash
} from "lucide-react"

export default function CreatePost() {
  const router = useRouter()
  const [postType, setPostType] = useState("text")
  const [selectedCommunity, setSelectedCommunity] = useState("profile")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isNSFW, setIsNSFW] = useState(false)
  const [isSpoiler, setIsSpoiler] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Mock communities data - replace with actual data fetching
  const communities = [
    { id: 1, name: "Technology", slug: "technology", members: 1500000, icon: "🔧" },
    { id: 2, name: "Gaming", slug: "gaming", members: 2300000, icon: "🎮" },
    { id: 3, name: "Programming", slug: "programming", members: 890000, icon: "💻" },
    { id: 4, name: "Science", slug: "science", members: 1200000, icon: "🔬" },
    { id: 5, name: "Art", slug: "art", members: 650000, icon: "🎨" },
  ]

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove:string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Mock API call - replace with actual submission logic
      const postData = {
        title,
        content: postType === "text" ? content : postType === "link" ? linkUrl : "",
        type: postType,
        communityId: selectedCommunity === "profile" ? null : selectedCommunity,
        tags,
        nsfw: isNSFW,
        spoiler: isSpoiler,
      }

      console.log("Submitting post:", postData)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect after successful creation
      router.push("/")
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = title.trim().length > 0 && 
    (postType === "text" ? true : postType === "link" ? linkUrl.trim().length > 0 : true)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create a post</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Share your thoughts with the community
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="w-[500px]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Create Post</span>
                  </CardTitle>
                  {selectedCommunity && selectedCommunity !== "profile" && (
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <span>r/{communities.find(c => c.id.toString() === selectedCommunity)?.slug}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-4 w-4 p-0"
                        onClick={() => setSelectedCommunity("profile")}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Community Selection */}
                  <div className="space-y-2">
                    <Label>Choose a community (optional)</Label>
                    <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a community or post to your profile" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="p-2">
                          <div className="relative">
                            <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
                            <Input
                              placeholder="Search communities..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-8"
                            />
                          </div>
                        </div>
                        <Separator />
                        <SelectItem value="profile">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">u/</span>
                            </div>
                            <span>Your Profile</span>
                          </div>
                        </SelectItem>
                        {filteredCommunities.map((community) => (
                          <SelectItem key={community.id} value={community.id.toString()}>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{community.icon}</span>
                              <div>
                                <div className="font-medium">r/{community.slug}</div>
                                <div className="text-xs text-gray-500">
                                  {community.members.toLocaleString()} members
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Post Type Tabs */}
                  <Tabs value={postType} onValueChange={setPostType}>
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="text" className="flex items-center space-x-1">
                        <FileText className="w-4 h-4" />
                        <span>Text</span>
                      </TabsTrigger>
                      <TabsTrigger value="image" className="flex items-center space-x-1">
                        <Image className="w-4 h-4" />
                        <span>Image</span>
                      </TabsTrigger>
                      <TabsTrigger value="link" className="flex items-center space-x-1">
                        <LinkIcon className="w-4 h-4" />
                        <span>Link</span>
                      </TabsTrigger>
                      <TabsTrigger value="video" className="flex items-center space-x-1">
                        <Video className="w-4 h-4" />
                        <span>Video</span>
                      </TabsTrigger>
                    </TabsList>

                    {/* Title Input (Common for all types) */}
                    <div className="mt-6 space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        placeholder="An interesting title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={300}
                        required
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Be specific and clear</span>
                        <span>{title.length}/300</span>
                      </div>
                    </div>

                    {/* Text Post Content */}
                    <TabsContent value="text" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="content">Text (optional)</Label>
                        <Textarea
                          id="content"
                          placeholder="What are your thoughts?"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          rows={8}
                          className="resize-none"
                        />
                      </div>
                    </TabsContent>

                    {/* Image Post Content */}
                    <TabsContent value="image" className="space-y-4">
                      <div className="space-y-2">
                        <Label>Upload Image</Label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-500 dark:text-gray-400">
                            Drag and drop or click to upload
                          </p>
                          <Button type="button" variant="outline" className="mt-2">
                            Choose File
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Link Post Content */}
                    <TabsContent value="link" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="link-url">URL *</Label>
                        <Input
                          id="link-url"
                          type="url"
                          placeholder="https://example.com"
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                          required
                        />
                      </div>
                    </TabsContent>

                    {/* Video Post Content */}
                    <TabsContent value="video" className="space-y-4">
                      <div className="space-y-2">
                        <Label>Upload Video</Label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                          <Video className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-500 dark:text-gray-400">
                            Drag and drop or click to upload video
                          </p>
                          <Button type="button" variant="outline" className="mt-2">
                            Choose Video
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label>Tags (optional)</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                          <Hash className="w-3 h-3" />
                          <span>{tag}</span>
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="sm" 
                            className="h-4 w-4 p-0"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                        maxLength={20}
                      />
                      <Button type="button" onClick={addTag} variant="outline">
                        Add
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Add up to 5 tags to help people find your post
                    </p>
                  </div>

                  {/* Post Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="nsfw"
                          checked={isNSFW}
                          onCheckedChange={setIsNSFW}
                        />
                        <Label htmlFor="nsfw">NSFW</Label>
                      </div>
                      <p className="text-xs text-gray-500">Not Safe For Work</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="spoiler"
                          checked={isSpoiler}
                          onCheckedChange={setIsSpoiler}
                        />
                        <Label htmlFor="spoiler">Spoiler</Label>
                      </div>
                      <p className="text-xs text-gray-500">Hide content behind spoiler warning</p>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="outline" asChild>
                      <Link href="/">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={!isFormValid || isSubmitting}>
                      {isSubmitting ? "Posting..." : "Post"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Posting Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertCircle className="w-10 h-5 mr-2" />
                  Posting Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                    <span>Be respectful and civil</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                    <span>No spam or self-promotion</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                    <span>Use descriptive titles</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                    <span>Mark NSFW content appropriately</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                    <span>Check for duplicate posts</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            {title && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                    {selectedCommunity && selectedCommunity !== "profile" && (
                      <div className="text-xs text-gray-500 mb-1">
                        r/{communities.find(c => c.id.toString() === selectedCommunity)?.slug}
                      </div>
                    )}
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {title}
                    </h3>
                    {content && postType === "text" && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {content.substring(0, 100)}...
                      </p>
                    )}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}