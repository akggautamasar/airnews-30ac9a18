
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
});

type ApiKeyProviderProps = {
  title: string;
  description: string;
  secretName: string;
  documentationUrl: string;
};

function ApiKeyProvider({ title, description, secretName, documentationUrl }: ApiKeyProviderProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      const response = await supabase.functions.invoke('update-api-keys', {
        body: {
          key: secretName,
          value: values.apiKey
        }
      });
      
      if (response.error) {
        toast.error(`Failed to update ${title} API key: ${response.error.message}`);
        console.error('Error updating API key:', response.error);
        return;
      }
      
      toast.success(`${title} API key updated successfully!`);
      form.reset({ apiKey: "" });
    } catch (error) {
      console.error('Error updating API key:', error);
      toast.error(`Failed to update ${title} API key`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your API key" {...field} />
                  </FormControl>
                  <FormDescription>
                    This API key will be stored securely in Supabase secrets.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col space-y-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save API Key"}
              </Button>
              <a 
                href={documentationUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline text-center text-sm"
              >
                Visit {title} website to get an API key
              </a>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function ApiKeysPage() {
  // Array of supported news providers
  const newsProviders = [
    {
      id: "guardian",
      title: "Guardian",
      description: "Get an API key from Guardian by registering at https://open-platform.theguardian.com/",
      secretName: "GUARDIAN_API_KEY",
      documentationUrl: "https://open-platform.theguardian.com/"
    },
    {
      id: "newsapi",
      title: "News API",
      description: "Get an API key from News API by registering at https://newsapi.org/",
      secretName: "NEWS_API_KEY",
      documentationUrl: "https://newsapi.org/"
    },
    {
      id: "thenewsapi",
      title: "The News API",
      description: "Get an API key from The News API by registering at https://www.thenewsapi.com/",
      secretName: "THE_NEWS_API_KEY",
      documentationUrl: "https://www.thenewsapi.com/"
    },
    {
      id: "gnews",
      title: "GNews",
      description: "Get a free API key from GNews by registering at https://gnews.io/",
      secretName: "GNEWS_API_KEY",
      documentationUrl: "https://gnews.io/"
    },
    {
      id: "worldnewsapi",
      title: "World News API",
      description: "Get an API key from World News API by registering at https://worldnewsapi.com/",
      secretName: "WORLDNEWS_API_KEY",
      documentationUrl: "https://worldnewsapi.com/"
    },
    {
      id: "newsdataai",
      title: "NewsData.io",
      description: "Get an API key from NewsData.io by registering at https://newsdata.io/",
      secretName: "NEWSDATA_IO_API_KEY",
      documentationUrl: "https://newsdata.io/"
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">News API Keys Management</h1>
      
      <Alert className="mb-6">
        <AlertDescription>
          Enter your API keys for various news providers. These will be stored securely in Supabase.
          After adding a key, you may need to wait a few minutes for the changes to propagate.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="guardian" className="w-full">
        <TabsList className="mb-8 flex flex-wrap">
          {newsProviders.map(provider => (
            <TabsTrigger key={provider.id} value={provider.id}>{provider.title}</TabsTrigger>
          ))}
        </TabsList>
        
        {newsProviders.map(provider => (
          <TabsContent key={provider.id} value={provider.id} className="space-y-4">
            <ApiKeyProvider 
              title={provider.title}
              description={provider.description}
              secretName={provider.secretName}
              documentationUrl={provider.documentationUrl}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
