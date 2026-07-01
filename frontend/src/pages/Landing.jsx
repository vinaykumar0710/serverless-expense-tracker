import { Link } from 'react-router-dom';
import {
  Cloud,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  Receipt,
  Wallet,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';
import Button from '../components/ui/Button';

const features = [
  {
    icon: Receipt,
    title: 'Smart Expense Tracking',
    description: 'Log and categorize expenses effortlessly with our intuitive interface. Never lose track of where your money goes.',
    color: '#F97316',
  },
  {
    icon: BarChart3,
    title: 'Powerful Analytics',
    description: 'Visualize spending patterns with interactive charts. Gain insights that help you make smarter financial decisions.',
    color: '#3B82F6',
  },
  {
    icon: Wallet,
    title: 'Budget Management',
    description: 'Set monthly budgets and get real-time alerts when approaching limits. Stay in control of your finances.',
    color: '#22C55E',
  },
  {
    icon: Shield,
    title: 'Serverless & Secure',
    description: 'Built on AWS serverless architecture. Your data is encrypted, scalable, and always available.',
    color: '#A855F7',
  },
];

const steps = [
  { step: '01', title: 'Create Account', description: 'Sign up in seconds with just your email' },
  { step: '02', title: 'Add Expenses', description: 'Log your daily expenses with categories' },
  { step: '03', title: 'Track & Optimize', description: 'View insights and optimize your spending' },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-bg">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-bg/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
              <Cloud className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-text-primary tracking-tight">CloudSpend</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" icon={ArrowRight}>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            Serverless Expense Tracking
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-text-primary leading-tight mb-6 animate-slide-up">
            Take Control of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
              Your Spending
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
            Track expenses, analyze spending patterns, and manage budgets — all in one beautifully designed, 
            serverless platform built for the modern cloud.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link to="/register">
              <Button size="lg" icon={ArrowRight}>
                Start Free Trial
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-16 animate-slide-up" style={{ animationDelay: '300ms' }}>
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '$2M+', label: 'Tracked' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-xs text-text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Everything You Need
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              A complete toolkit to track, analyze, and optimize your personal and business expenses.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-surface rounded-xl border border-border p-6 hover:border-primary/20 
                  hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 
                    group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              How It Works
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Get started in three simple steps. No credit card required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <div key={item.step} className="text-center animate-slide-up" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="text-5xl font-extrabold text-primary/15 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-gradient-to-br from-primary/10 to-cyan-500/5 rounded-2xl border border-primary/20 p-10 lg:p-16">
            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Ready to Optimize Your Spending?
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto mb-8">
              Join thousands of users who have already transformed how they manage their expenses.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register">
                <Button size="lg" icon={ArrowRight}>Create Free Account</Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-text-muted">
              {['No credit card', 'Free forever', 'Cancel anytime'].map((text) => (
                <div key={text} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-success" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-text-primary">CloudSpend</span>
          </div>
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} CloudSpend. Built with ☁️ on AWS Serverless.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
