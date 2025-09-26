"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, MapPin, Phone, Mail, School } from "lucide-react"
import Link from "next/link"

interface SchoolType {
  id: number
  name: string
  address: string
  city: string
  state: string
  contact: string
  image?: string
  email_id: string
  created_at: string
}

export default function ShowSchoolsPage() {
  const [schools, setSchools] = useState<SchoolType[]>([])
  const [filteredSchools, setFilteredSchools] = useState<SchoolType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchSchools()
  }, [])

  useEffect(() => {
    const filtered = schools.filter(
      (school) =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.state.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredSchools(filtered)
  }, [schools, searchTerm])

  const fetchSchools = async () => {
    try {
      const response = await fetch("/api/schools")
      if (response.ok) {
        const data = await response.json()
        setSchools(data)
      }
    } catch (error) {
      console.error("Failed to fetch schools:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading schools...</p>
        </div>
      </div>
    )
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

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <School className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Schools</h1>
          <p className="text-gray-600">Browse through our registered schools</p>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search schools by name, city, or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredSchools.length === 0 ? (
          <div className="text-center py-12">
            <School className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? "No schools found" : "No schools registered yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? "Try adjusting your search terms" : "Be the first to add a school to the system"}
            </p>
            {!searchTerm && (
              <Link href="/add-school">
                <Button>Add First School</Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <Badge variant="secondary" className="text-sm">
                {filteredSchools.length} school{filteredSchools.length !== 1 ? "s" : ""} found
              </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSchools.map((school) => (
                <Card key={school.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-200 relative">
                    {school.image ? (
                      <img
                        src={school.image || "/placeholder.svg"}
                        alt={school.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <School className="h-12 w-12 text-blue-400" />
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl text-balance">{school.name}</CardTitle>
                    <CardDescription className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="text-pretty">
                        {school.city}, {school.state}
                      </span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <p className="text-pretty">{school.address}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-green-600 flex-shrink-0" />
                        <span>{school.contact}</span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                        <span className="truncate">{school.email_id}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-500">
                        Added on {new Date(school.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
