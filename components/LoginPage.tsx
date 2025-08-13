import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { User } from '../App';
import { Building2, Lock, UserCheck, Shield, Mail, UserPlus } from 'lucide-react';
import { signIn } from '../utils/supabase/auth';
import { toast } from 'sonner';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onRegister: () => void;
  onTestConnection?: () => void;
}

export function LoginPage({ onLogin, onRegister, onTestConnection }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const authUser = await signIn(email, password);
      
      if (authUser) {
        const user: User = {
          id: authUser.id,
          username: authUser.username || email.split('@')[0],
          puskesmas: authUser.puskesmas || 'Default Puskesmas',
          location: authUser.location || 'Default Location'
        };
        onLogin(user);
        toast.success('Login successful!');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-8">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">SPASI</h1>
          <p className="text-muted-foreground">Sistem Pencatatan Kasus LP3I</p>
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
            <Building2 className="w-4 h-4" />
            <span>Puskesmas Digital Indonesia</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              className="spasi-input"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="spasi-input"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full spasi-button"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                Memuat...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Masuk
              </div>
            )}
          </Button>
        </form>

        <div className="mt-6 flex flex-col gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onRegister}
            className="w-full"
          >
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Daftar Akun Baru
            </div>
          </Button>
          
          {onTestConnection && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onTestConnection}
              className="w-full"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Test Supabase Connection
              </div>
            </Button>
          )}
          
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 flex-shrink-0" />
              <div>
                <p>Hubungi admin jika ada masalah login.</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
