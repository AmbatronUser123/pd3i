import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Building2, Lock, UserCheck, Mail, MapPin, Building } from 'lucide-react';
import { signUp } from '../utils/supabase/auth';
import { toast } from 'sonner';

interface RegisterPageProps {
  onBack: () => void;
}

export function RegisterPage({ onBack }: RegisterPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [puskesmas, setPuskesmas] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const user = await signUp(email, password, username, puskesmas, location);
      
      if (user) {
        toast.success('Registration successful! Please check your email for verification.');
        onBack(); // Go back to login page
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register. Please try again.');
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
          <p className="text-muted-foreground">Daftar Akun Baru</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
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
            <Label htmlFor="username" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Nama Pengguna
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan nama pengguna"
              className="spasi-input"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="puskesmas" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Puskesmas
            </Label>
            <Input
              id="puskesmas"
              type="text"
              value={puskesmas}
              onChange={(e) => setPuskesmas(e.target.value)}
              placeholder="Nama puskesmas"
              className="spasi-input"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Lokasi
            </Label>
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Kota/Kabupaten"
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Konfirmasi Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Konfirmasi password"
              className="spasi-input"
              required
            />
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              Kembali
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !email || !password || !confirmPassword || !username || !puskesmas || !location}
              className="flex-1"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  Memuat...
                </div>
              ) : (
                'Daftar'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
