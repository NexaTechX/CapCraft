import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { captionTemplates, CaptionTemplate } from "@/lib/templates";
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { FileText, Plus, Edit, Trash2, Copy } from "lucide-react";

const TemplatesPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [templates, setTemplates] =
    useState<CaptionTemplate[]>(captionTemplates);
  const [newTemplate, setNewTemplate] = useState<Partial<CaptionTemplate>>({
    name: "",
    description: "",
    template: "",
    category: "personal",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const categories = ["all", "promotional", "personal", "event"] as const;

  const filteredTemplates =
    activeTab === "all"
      ? templates
      : templates.filter((template) => template.category === activeTab);

  const handleCopyTemplate = (template: CaptionTemplate) => {
    navigator.clipboard.writeText(template.template);
    toast({
      title: "Template Copied",
      description: "Template has been copied to clipboard",
    });
  };

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.template) {
      toast({
        title: "Error",
        description: "Name and template content are required",
        variant: "destructive",
      });
      return;
    }

    const newId = `custom-${Date.now()}`;
    const templateToAdd: CaptionTemplate = {
      id: newId,
      name: newTemplate.name,
      description: newTemplate.description || "Custom template",
      template: newTemplate.template,
      category:
        (newTemplate.category as "promotional" | "personal" | "event") ||
        "personal",
    };

    setTemplates([...templates, templateToAdd]);
    setNewTemplate({
      name: "",
      description: "",
      template: "",
      category: "personal",
    });
    setIsDialogOpen(false);

    toast({
      title: "Template Created",
      description: "Your custom template has been created",
    });
  };

  const handleUseTemplate = (template: CaptionTemplate) => {
    // In a real app, this would navigate to the caption generator with the template
    window.location.href = "/dashboard?template=" + template.id;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Caption Templates</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={newTemplate.name}
                    onChange={(e) =>
                      setNewTemplate({ ...newTemplate, name: e.target.value })
                    }
                    placeholder="E.g., Product Launch Announcement"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newTemplate.description}
                    onChange={(e) =>
                      setNewTemplate({
                        ...newTemplate,
                        description: e.target.value,
                      })
                    }
                    placeholder="Brief description of when to use this template"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newTemplate.category}
                    onChange={(e) =>
                      setNewTemplate({
                        ...newTemplate,
                        category: e.target.value as any,
                      })
                    }
                  >
                    <option value="promotional">Promotional</option>
                    <option value="personal">Personal</option>
                    <option value="event">Event</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="template">Template Content</Label>
                  <Textarea
                    id="template"
                    value={newTemplate.template}
                    onChange={(e) =>
                      setNewTemplate({
                        ...newTemplate,
                        template: e.target.value,
                      })
                    }
                    placeholder="Write your template here. Use {placeholders} for dynamic content."
                    className="min-h-[120px]"
                  />
                  <p className="text-xs text-gray-500">
                    Use curly braces for placeholders, e.g., {"{product_name}"}
                  </p>
                </div>
                <Button onClick={handleCreateTemplate}>Create Template</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="capitalize"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <Card className="p-6">
            <ScrollArea className="h-[600px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Card className="p-4 hover:shadow-md transition-shadow border-violet-100/50">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{template.name}</h3>
                        <Badge
                          variant="outline"
                          className="capitalize bg-violet-50 text-violet-700 border-violet-200"
                        >
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {template.description}
                      </p>
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-100 mb-3 text-sm">
                        {template.template}
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-violet-200 hover:bg-violet-50 text-violet-700"
                          onClick={() => handleCopyTemplate(template)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                          onClick={() => handleUseTemplate(template)}
                        >
                          Use Template
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TemplatesPage;

const Badge = ({ children, className, variant }: any) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}
    >
      {children}
    </span>
  );
};
