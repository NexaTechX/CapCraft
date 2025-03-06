import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { captionTemplates, CaptionTemplate } from "@/lib/templates";

interface TemplateLibraryProps {
  onSelectTemplate: (template: CaptionTemplate) => void;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  onSelectTemplate,
}) => {
  const categories = ["promotional", "personal", "event"] as const;

  return (
    <Card className="p-4 bg-white">
      <h2 className="text-xl font-semibold mb-4">Template Library</h2>
      <Tabs defaultValue="promotional">
        <TabsList className="mb-4">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {captionTemplates
                  .filter((template) => template.category === category)
                  .map((template) => (
                    <Card key={template.id} className="p-4">
                      <h3 className="font-medium mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {template.description}
                      </p>
                      <p className="text-sm bg-gray-50 p-2 rounded mb-3">
                        {template.template}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectTemplate(template)}
                      >
                        Use Template
                      </Button>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};

export default TemplateLibrary;
