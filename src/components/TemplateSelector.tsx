import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { captionTemplates, CaptionTemplate } from "@/lib/templates";
import { motion } from "framer-motion";
import { FileText, Plus } from "lucide-react";

interface TemplateSelectorProps {
  onSelectTemplate: (template: CaptionTemplate) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onSelectTemplate,
}) => {
  const categories = ["promotional", "personal", "event"] as const;

  return (
    <Card className="p-4 bg-white shadow-sm border-violet-100/50">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FileText className="mr-2 h-5 w-5 text-violet-600" />
        Template Library
      </h2>
      <Tabs defaultValue="promotional">
        <TabsList className="mb-4 w-full">
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
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <Card
                        key={template.id}
                        className="p-4 hover:shadow-md transition-shadow border-violet-100/50"
                      >
                        <h3 className="font-medium mb-2">{template.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {template.description}
                        </p>
                        <p className="text-sm bg-gray-50 p-2 rounded mb-3 border border-gray-100">
                          {template.template}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSelectTemplate(template)}
                          className="w-full justify-center border-violet-200 hover:bg-violet-50 text-violet-700"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Use Template
                        </Button>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};

export default TemplateSelector;
