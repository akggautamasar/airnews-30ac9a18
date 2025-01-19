import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { AuthError } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

const profileFormSchema = z.object({
  display_name: z.string().min(2, "Name must be at least 2 characters"),
  mobile_number: z.string().min(10, "Please enter a valid mobile number"),
  date_of_birth: z.string().min(1, "Please select your date of birth"),
  location: z.string().min(1, "Please enter your location"),
  interests: z.string().optional(),
});

const Auth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [session, setSession] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      display_name: "",
      mobile_number: "",
      date_of_birth: "",
      location: "",
      interests: "",
    },
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setSession(session);
          setShowProfileForm(true);
          
          // Fetch existing profile data
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profile && !profileError) {
            form.reset({
              display_name: profile.display_name || "",
              mobile_number: profile.mobile_number || "",
              date_of_birth: profile.date_of_birth || "",
              location: profile.location || "",
              interests: profile.interests?.join(', ') || "",
            });
          }
        } else if (event === "SIGNED_OUT") {
          navigate("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, form]);

  const getErrorMessage = (error: AuthError) => {
    switch (error.message) {
      case "Invalid login credentials":
        return "Invalid email or password. Please check your credentials.";
      case "Email not confirmed":
        return "Please verify your email address before signing in.";
      default:
        return error.message;
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      if (!session?.user?.id) {
        throw new Error("No user session found");
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: data.display_name,
          mobile_number: data.mobile_number,
          date_of_birth: data.date_of_birth,
          location: data.location,
          interests: data.interests.split(',').map(i => i.trim()).filter(i => i),
        })
        .eq('id', session.user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      navigate("/");
    } catch (error) {
      console.error('Profile update error:', error);
      setErrorMessage(error.message || "Error updating profile. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Welcome to Airnews</h1>
          <p className="mt-2 text-gray-600">Sign in to access all features</p>
        </div>
        
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {!showProfileForm ? (
          <div className="bg-white p-8 rounded-lg shadow">
            <SupabaseAuth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#1a237e',
                      brandAccent: '#3949ab',
                    },
                  },
                },
              }}
              providers={[]}
            />
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-6">Complete Your Profile</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="display_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobile_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interests (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="Technology, Sports, Music" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Complete Profile"}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;