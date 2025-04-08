import React, { useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "./ui/button";
import CurrencyDashboard from "./CurrencyDashboard";
import CurrencyConverter from "./CurrencyConverter";
import HistoricalCharts from "./HistoricalCharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, you would apply the dark mode class to the document
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className={`min-h-screen bg-background ${darkMode ? "dark" : ""}`}>
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <h1 className="text-xl font-bold">Currency Tracker</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {darkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
            <span className="sr-only">
              {darkMode ? "Light mode" : "Dark mode"}
            </span>
          </Button>
        </div>
      </header>

      <main className="container py-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <div className="mb-6 flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="converter">Converter</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold">
                Real-Time Exchange Rates
              </h2>
              <CurrencyDashboard />
            </div>
          </TabsContent>

          <TabsContent value="converter" className="space-y-6">
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold">Currency Converter</h2>
              <CurrencyConverter />
            </div>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold">
                Historical Exchange Rates
              </h2>
              <HistoricalCharts />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t bg-background py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Currency Tracker. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
