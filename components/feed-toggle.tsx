"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FeedToggle() {
  const [activeTab, setActiveTab] = useState("latest")

  return (
    <div className="mb-6">
      <Tabs defaultValue="latest" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="latest">Latest</TabsTrigger>
          <TabsTrigger value="top">Top</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
