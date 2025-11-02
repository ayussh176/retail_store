import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Store } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [isSignup, setIsSignup] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || (isSignup && !name)) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (isSignup) {
        await signup(email, password, name, role);
        toast.success(`Account created! Welcome ${name}`);
      } else {
        await login(email, password, role);
        toast.success(`Welcome back!`);
      }
      navigate(role === 'customer' ? '/customer/products' : '/retailer/inventory');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Operation failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-2">
            <Store className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">RetailHub</CardTitle>
          <CardDescription>Inventory & Sales Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={role} onValueChange={(v) => setRole(v as UserRole)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="customer" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Customer
              </TabsTrigger>
              <TabsTrigger value="retailer" className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                Retailer
              </TabsTrigger>
            </TabsList>
            <TabsContent value="customer">
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignup && (
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Full Name</Label>
                    <Input
                      id="customer-name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="customer-email">Email</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    placeholder="customer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-password">Password</Label>
                  <Input
                    id="customer-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {isSignup ? 'Sign Up' : 'Login'} as Customer
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignup(!isSignup)}
                    className="text-primary hover:underline"
                  >
                    {isSignup ? 'Login' : 'Sign Up'}
                  </button>
                </p>
              </form>
            </TabsContent>
            <TabsContent value="retailer">
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignup && (
                  <div className="space-y-2">
                    <Label htmlFor="retailer-name">Full Name</Label>
                    <Input
                      id="retailer-name"
                      type="text"
                      placeholder="Jane Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="retailer-email">Email</Label>
                  <Input
                    id="retailer-email"
                    type="email"
                    placeholder="retailer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retailer-password">Password</Label>
                  <Input
                    id="retailer-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {isSignup ? 'Sign Up' : 'Login'} as Retailer
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignup(!isSignup)}
                    className="text-primary hover:underline"
                  >
                    {isSignup ? 'Login' : 'Sign Up'}
                  </button>
                </p>
              </form>
            </TabsContent>
          </Tabs>
          <p className="text-sm text-muted-foreground text-center mt-6">
            {isSignup ? 'Create your account to get started' : 'Mock authentication - Sign up to create an account'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
