import type { Community } from "@prisma/client"

interface CommunityHeaderProps {
  community: Community
}

export default function CommunityHeader({ community }: CommunityHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center gap-4">
        <div className="bg-orange-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
          r/
        </div>
        <div>
          <h1 className="text-2xl font-bold">r/{community.slug}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Created {new Date(community.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}
