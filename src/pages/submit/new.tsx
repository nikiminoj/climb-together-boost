import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import useCategories from "@/hooks/useCategories";
import { Link, Upload, Tag } from "lucide-react";
import React, { useState } from "react";

interface SubmitNewProps {
  onClose?: () => void;
}

const SubmitNew: React.FC<SubmitNewProps> = ({ onClose }) => {
    const [formData, setFormData] = useState({
    name: '',
    description: '',
    link: '',
    category: '',
    image: '',
    tags: '',
  });

  const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories } = useCategories();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Product submitted!',
      description:
        'Your product has been submitted for review and will appear in the directory soon.',
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Submit Your Product</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="Enter your product name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what your product does and what makes it special"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                Product Link *
              </Label>
              <Input
                id="link"
                type="url"
                placeholder="https://yourproduct.com"
                value={formData.link}
                onChange={(e) => handleInputChange('link', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingCategories && <SelectItem value="loading" disabled>Loading categories...</SelectItem>}
                  {isErrorCategories && <SelectItem value="error" disabled>Error loading categories</SelectItem>}
                  {categories && categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug || category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>

              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Product Image URL
              </Label>
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
              />
              <p className="text-xs text-gray-600">
                Recommended: 400x300px or similar aspect ratio
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags (Optional)
              </Label>
              <Input
                id="tags"
                placeholder="saas, productivity, ai, startup (comma separated)"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tips:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • Use a compelling description that highlights your unique
                  value proposition
                </li>
                <li>
                  • Add a high-quality screenshot or logo as your product image
                </li>
                <li>
                  • Choose the most relevant category to help users discover
                  your product
                </li>
                <li>
                  • Include a working demo or trial link to maximize engagement
                </li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
              >
                Submit Product
              </Button>
              <Button type="button" variant="outline" onClick={onClose || (() => {})}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default SubmitNew;