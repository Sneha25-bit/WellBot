import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Heart, Shield, Calendar, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const ProfileSetup = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    allergies: "",
    chronic_illness: "",
    enable_period_tracker: false
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          age: parseInt(formData.age) || null,
          gender: formData.gender,
          allergies: formData.allergies,
          chronic_illness: formData.chronic_illness,
          enable_period_tracker: formData.enable_period_tracker
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated!",
        description: "Your health profile has been saved successfully.",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen soft-gradient p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl mx-auto medical-card animate-fade-in-up">
        <CardHeader className="text-center pb-8">
          <div className="hero-gradient w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Set Up Your Health Profile</CardTitle>
          <CardDescription className="text-lg">
            Help us personalize your health companion experience
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-sm font-medium">First Name</Label>
                <Input
                  id="first_name"
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  className="medical-card"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-sm font-medium">Last Name</Label>
                <Input
                  id="last_name"
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  className="medical-card"
                />
              </div>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="medical-card"
              />
            </div>

            {/* Gender Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                <SelectTrigger className="medical-card">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Health Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Health Information</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allergies" className="text-sm font-medium">Known Allergies</Label>
                <Input
                  id="allergies"
                  type="text"
                  placeholder="e.g., peanuts, shellfish, none"
                  value={formData.allergies}
                  onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                  className="medical-card"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chronic_illness" className="text-sm font-medium">Chronic Conditions</Label>
                <Input
                  id="chronic_illness"
                  type="text"
                  placeholder="e.g., diabetes, hypertension, none"
                  value={formData.chronic_illness}
                  onChange={(e) => setFormData({...formData, chronic_illness: e.target.value})}
                  className="medical-card"
                />
              </div>
            </div>

            {/* Period Tracker Option */}
            {formData.gender === "female" && (
              <div className="medical-card p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-secondary" />
                  <h3 className="font-semibold text-foreground">Period Tracking</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="periodTracker"
                    checked={formData.enable_period_tracker}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, enable_period_tracker: checked as boolean})
                    }
                  />
                  <Label htmlFor="periodTracker" className="text-sm">
                    Enable period tracker and cycle predictions
                  </Label>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="hero" 
              size="lg" 
              className="w-full"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Complete Setup
              <Heart className="ml-2 w-5 h-5" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;