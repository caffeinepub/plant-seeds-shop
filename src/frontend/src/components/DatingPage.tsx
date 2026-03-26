import { Heart, Leaf, MapPin, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  bio: string;
  interests: string[];
  image: string;
  liked: boolean;
}

const initialProfiles: Profile[] = [
  {
    id: 1,
    name: "Sarah",
    age: 26,
    location: "Mumbai",
    bio: "Plant lover and weekend gardener. I grow my own vegetables and herbs at home. Looking for someone who shares my love for nature.",
    interests: ["Gardening", "Hiking", "Cooking", "Photography"],
    image: "/assets/generated/dating-sarah.dim_400x500.jpg",
    liked: false,
  },
  {
    id: 2,
    name: "James",
    age: 28,
    location: "Bangalore",
    bio: "Sustainable living enthusiast. I have a balcony full of succulents and herbs. Coffee lover and nature explorer.",
    interests: ["Succulents", "Sustainability", "Coffee", "Trekking"],
    image: "/assets/generated/dating-james.dim_400x500.jpg",
    liked: false,
  },
  {
    id: 3,
    name: "Priya",
    age: 25,
    location: "Delhi",
    bio: "Flower enthusiast and amateur botanist. My balcony is a mini floral paradise. Love reading and flower arranging.",
    interests: ["Flowers", "Botany", "Reading", "Yoga"],
    image: "/assets/generated/dating-priya.dim_400x500.jpg",
    liked: false,
  },
  {
    id: 4,
    name: "Arjun",
    age: 30,
    location: "Chennai",
    bio: "Urban farmer with a passion for growing exotic fruits. Looking for a partner who appreciates fresh, homegrown food.",
    interests: ["Fruit Trees", "Cooking", "Cycling", "Music"],
    image: "/assets/generated/dating-arjun.dim_400x500.jpg",
    liked: false,
  },
  {
    id: 5,
    name: "Emily",
    age: 27,
    location: "Pune",
    bio: "Herbal tea fanatic who grows her own mint, chamomile, and lavender. Love morning walks and peaceful evenings.",
    interests: ["Herbs", "Tea", "Painting", "Morning Walks"],
    image: "/assets/generated/dating-emily.dim_400x500.jpg",
    liked: false,
  },
  {
    id: 6,
    name: "Rahul",
    age: 29,
    location: "Hyderabad",
    bio: "Tree planter and environmental activist. I believe small actions like planting seeds can change the world.",
    interests: ["Trees", "Environment", "Photography", "Travel"],
    image: "/assets/generated/dating-rahul.dim_400x500.jpg",
    liked: false,
  },
];

export default function DatingPage() {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [matchedName, setMatchedName] = useState<string | null>(null);

  const handleLike = (id: number, name: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, liked: true } : p)),
    );
    setMatchedName(name);
    setTimeout(() => setMatchedName(null), 3000);
  };

  const handleDislike = (id: number) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, liked: false } : p)),
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white py-12 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-8 h-8 fill-white" />
          <h1 className="text-3xl font-bold">GreenSprout Dating</h1>
          <Heart className="w-8 h-8 fill-white" />
        </div>
        <p className="text-rose-100 text-lg max-w-xl mx-auto">
          Find someone who shares your love for plants, nature, and green living
        </p>
      </div>

      {/* Match Toast */}
      {matchedName && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-rose-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          <Heart className="w-5 h-5 fill-white" />
          <span className="font-semibold">You liked {matchedName}! 💚</span>
        </div>
      )}

      {/* Profiles Grid */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-rose-100"
            >
              {/* Photo */}
              <div className="relative">
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-full h-72 object-cover"
                  loading="eager"
                />
                {profile.liked && (
                  <div className="absolute top-3 right-3 bg-rose-500 text-white rounded-full p-1.5">
                    <Heart className="w-4 h-4 fill-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-bold text-gray-800">
                    {profile.name}, {profile.age}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    {profile.location}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {profile.bio}
                </p>

                {/* Interests */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {profile.interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant="secondary"
                      className="bg-green-100 text-green-700 text-xs flex items-center gap-1"
                    >
                      <Leaf className="w-3 h-3" />
                      {interest}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-gray-200 text-gray-500 hover:bg-gray-50"
                    onClick={() => handleDislike(profile.id)}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Pass
                  </Button>
                  <Button
                    size="sm"
                    className={`flex-1 ${
                      profile.liked
                        ? "bg-rose-200 text-rose-600 hover:bg-rose-200 cursor-default"
                        : "bg-rose-500 hover:bg-rose-600 text-white"
                    }`}
                    onClick={() =>
                      !profile.liked && handleLike(profile.id, profile.name)
                    }
                  >
                    <Heart
                      className={`w-4 h-4 mr-1 ${
                        profile.liked ? "fill-rose-500" : ""
                      }`}
                    />
                    {profile.liked ? "Liked!" : "Connect"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-200 text-green-600 hover:bg-green-50"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
