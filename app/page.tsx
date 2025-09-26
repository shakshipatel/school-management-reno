import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { School, Plus, Eye } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600 rounded-full">
              <School className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">School Management System</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage school information efficiently with our comprehensive system. Add new schools and view existing ones
            in a beautiful, responsive interface.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Plus className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Add New School</CardTitle>
              <CardDescription>
                Register a new school with complete information including contact details and images
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/add-school">
                <Button size="lg" className="w-full">
                  <Plus className="mr-2 h-5 w-5" />
                  Add School
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">View Schools</CardTitle>
              <CardDescription>
                Browse all registered schools in an elegant grid layout with detailed information
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/show-schools">
                <Button variant="outline" size="lg" className="w-full bg-transparent">
                  <Eye className="mr-2 h-5 w-5" />
                  View Schools
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
