import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CurrencyCardProps {
  currencyCode: string;
  baseCurrency: string;
  rate: number;
  percentageChange: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
}

const CurrencyCard = ({
  currencyCode = "USD",
  baseCurrency = "EUR",
  rate = 1.08,
  percentageChange = 0.25,
  isFavorite = false,
  onToggleFavorite = () => {},
  onClick = () => {},
}: CurrencyCardProps) => {
  // Format the rate to 4 decimal places
  const formattedRate = rate.toFixed(4);

  // Determine if the percentage change is positive, negative, or zero
  const isPositive = percentageChange > 0;
  const isNegative = percentageChange < 0;

  // Format the percentage change with a + or - sign and 2 decimal places
  const formattedPercentageChange = `${isPositive ? "+" : ""}${percentageChange.toFixed(2)}%`;

  // Get the flag emoji for the currency code (simple implementation)
  const getFlagEmoji = (code: string) => {
    // This is a simplified version - in a real app, you'd use a proper flag library
    // or map currency codes to country codes and then to flag emojis
    const countryCode = code.slice(0, 2);
    return String.fromCodePoint(
      ...Array.from(countryCode.toUpperCase()).map(
        (char) => char.charCodeAt(0) + 127397,
      ),
    );
  };

  return (
    <Card
      className="bg-card hover:shadow-md transition-all cursor-pointer h-full"
      onClick={onClick}
    >
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <span className="text-2xl mr-2">{getFlagEmoji(currencyCode)}</span>
            <div>
              <h3 className="text-lg font-semibold">{currencyCode}</h3>
              <p className="text-sm text-muted-foreground">
                {baseCurrency} Base
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
          >
            <Star
              className={`h-5 w-5 ${isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
            />
          </Button>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-end">
            <h2 className="text-2xl font-bold">{formattedRate}</h2>
            <Badge
              variant={
                isPositive
                  ? "default"
                  : isNegative
                    ? "destructive"
                    : "secondary"
              }
              className={`${isPositive ? "bg-green-500" : isNegative ? "bg-red-500" : "bg-gray-500"} text-white`}
            >
              {formattedPercentageChange}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyCard;
