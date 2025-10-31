import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faUsers, faBolt } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-accent">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-8 animate-pulse">
            <FontAwesomeIcon icon={faComments} className="text-5xl text-primary" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Simple Chat App
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Aplikasi chat sederhana dan modern dengan tampilan yang clean dan responsif.
            Mulai mengobrol sekarang!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              className="text-lg h-14 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Mulai Chat
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <FontAwesomeIcon icon={faBolt} className="text-2xl text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Cepat & Ringan</h3>
              <p className="text-sm text-muted-foreground">
                Interface modern dengan performa optimal
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <FontAwesomeIcon icon={faUsers} className="text-2xl text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">User Friendly</h3>
              <p className="text-sm text-muted-foreground">
                Desain intuitif seperti WhatsApp
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <FontAwesomeIcon icon={faComments} className="text-2xl text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Real-time Chat</h3>
              <p className="text-sm text-muted-foreground">
                Simulasi percakapan real-time yang smooth
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
