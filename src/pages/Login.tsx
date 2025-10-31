import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.trim().length < 2) {
      toast({
        title: "Username terlalu pendek",
        description: "Masukkan minimal 2 karakter",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('chat-username', username.trim());
    toast({
      title: "Berhasil masuk!",
      description: `Selamat datang, ${username}!`
    });
    navigate('/chat');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-accent p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-2xl p-8 border border-border">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <FontAwesomeIcon icon={faComments} className="text-4xl text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Simple Chat App</h1>
            <p className="text-muted-foreground">Masuk untuk mulai mengobrol</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Masukkan username Anda..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 text-base rounded-xl border-2 focus:border-primary transition-all"
                autoFocus
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
            >
              Masuk
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Tidak perlu password, cukup username saja!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
