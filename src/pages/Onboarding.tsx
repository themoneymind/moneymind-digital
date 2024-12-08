import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Link } from "react-router-dom";

const OnboardingSlides = [
  {
    title: "Track Your Finances",
    description: "Add your monthly details to track your finances at your fingertips.",
    image: "/placeholder.svg"
  },
  {
    title: "Track Credits",
    description: "Track credits you give to your friends.",
    image: "/placeholder.svg"
  },
  {
    title: "Update Profile",
    description: "Update your profile.",
    image: "/placeholder.svg"
  },
  {
    title: "Financial Freedom",
    description: "Start your financial freedom journey.",
    image: "/placeholder.svg"
  }
];

export const Onboarding = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col p-6">
      <div className="flex-1 flex flex-col items-center justify-between">
        {/* Logo */}
        <div className="w-full flex justify-center pt-8">
          <img
            src="/placeholder.svg"
            alt="MoneyMind Logo"
            className="h-12 w-auto"
          />
        </div>

        {/* Carousel */}
        <Carousel className="w-full max-w-xs mx-auto">
          <CarouselContent>
            {OnboardingSlides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="p-4 flex flex-col items-center text-center space-y-4">
                  <div className="w-48 h-48 bg-muted rounded-full flex items-center justify-center">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                  <h2 className="text-xl font-semibold">{slide.title}</h2>
                  <p className="text-muted-foreground">{slide.description}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        {/* Auth Buttons */}
        <div className="w-full space-y-4 mt-8">
          <Button asChild className="w-full h-14 rounded-[12px] text-base">
            <Link to="/signup">Sign Up</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full h-14 rounded-[12px] text-base"
          >
            <Link to="/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};