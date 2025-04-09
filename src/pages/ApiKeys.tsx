
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
  defaultValue?: string;
};

function ApiKeyProvider({ title, description, secretName }: ApiKeyProviderProps) {
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save API Key"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function ApiKeysPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">News API Keys Management</h1>
      
      <Alert className="mb-6">
        <AlertDescription>
          Enter your API keys for various news providers. These will be stored securely in Supabase.
          After adding a key, you may need to wait a few minutes for the changes to propagate.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="gnews" className="w-full">
        <TabsList className="mb-8 flex flex-wrap">
          <TabsTrigger value="gnews">GNews</TabsTrigger>
          <TabsTrigger value="worldnews">World News API</TabsTrigger>
          <TabsTrigger value="newsapi">News API</TabsTrigger>
          <TabsTrigger value="thenewsapi">The News API</TabsTrigger>
          <TabsTrigger value="guardian">Guardian</TabsTrigger>
          <TabsTrigger value="pixabay">Pixabay (Images)</TabsTrigger>
          <TabsTrigger value="pexels">Pexels (Images)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gnews" className="space-y-4">
          <ApiKeyProvider 
            title="GNews" 
            description="Get a free API key from GNews by registering at https://gnews.io/" 
            secretName="GNEWS_API_KEY" 
          />
          <div className="mt-4">
            <a 
              href="https://gnews.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Visit GNews website to get an API key
            </a>
          </div>
        </TabsContent>
        
        <TabsContent value="worldnews" className="space-y-4">
          <ApiKeyProvider 
            title="World News API" 
            description="Get an API key from World News API by registering at https://worldnewsapi.com/" 
            secretName="WORLDNEWS_API_KEY" 
          />
          <div className="mt-4">
            <a 
              href="https://worldnewsapi.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Visit World News API website to get an API key
            </a>
          </div>
        </TabsContent>
        
        <TabsContent value="newsapi" className="space-y-4">
          <ApiKeyProvider 
            title="News API" 
            description="Get an API key from News API by registering at https://newsapi.org/" 
            secretName="NEWS_API_KEY" 
          />
          <div className="mt-4">
            <a 
              href="https://newsapi.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Visit News API website to get an API key
            </a>
          </div>
        </TabsContent>
        
        <TabsContent value="thenewsapi" className="space-y-4">
          <ApiKeyProvider 
            title="The News API" 
            description="Get an API key from The News API by registering at https://www.thenewsapi.com/" 
            secretName="THE_NEWS_API_KEY" 
          />
          <div className="mt-4">
            <a 
              href="https://www.thenewsapi.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Visit The News API website to get an API key
            </a>
          </div>
        </TabsContent>
        
        <TabsContent value="guardian" className="space-y-4">
          <ApiKeyProvider 
            title="Guardian" 
            description="Get an API key from Guardian by registering at https://open-platform.theguardian.com/" 
            secretName="GUARDIAN_API_KEY" 
          />
          <div className="mt-4">
            <a 
              href="https://open-platform.theguardian.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Visit Guardian API website to get an API key
            </a>
          </div>
        </TabsContent>
        
        <TabsContent value="pixabay" className="space-y-4">
          <ApiKeyProvider 
            title="Pixabay" 
            description="Get an API key from Pixabay by registering at https://pixabay.com/api/docs/" 
            secretName="PIXABAY_API_KEY" 
          />
          <div className="mt-4">
            <a 
              href="https://pixabay.com/api/docs/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Visit Pixabay API website to get an API key
            </a>
          </div>
        </TabsContent>
        
        <TabsContent value="pexels" className="space-y-4">
          <ApiKeyProvider 
            title="Pexels" 
            description="Get an API key from Pexels by registering at https://www.pexels.com/api/" 
            secretName="PEXELS_API_KEY" 
          />
          <div className="mt-4">
            <a 
              href="https://www.pexels.com/api/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Visit Pexels API website to get an API key
            </a>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
