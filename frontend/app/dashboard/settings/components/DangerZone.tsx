import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function DangerZone() {
  return (
    <Card className="max-w-2xl border-red-300">
      <CardHeader>
        <CardTitle className="text-red-600">Danger Zone</CardTitle>
        <CardDescription>Irreversible actions for your account.</CardDescription>
      </CardHeader>

      <div className="px-6">
        <Separator className="bg-gray-200" />
      </div>

      <CardContent className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm">Delete Account</p>
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all associated data.
          </p>
        </div>

        <Button className="bg-red-600 hover:bg-red-700 text-white shrink-0 ml-4">
          Delete Account
        </Button>
      </CardContent>
    </Card>
  )
}