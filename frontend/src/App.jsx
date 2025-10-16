import './App.css'
import { Button } from './components/ui/button'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-4xl font-bold text-center p-8">
        Hotel Booking SaaS
      </h1>
      <p className="text-center text-muted-foreground">
        Powered by LiteAPI
      </p>
      <Button >
        Get Started
      </Button>
    </div>
  )
}

export default App
