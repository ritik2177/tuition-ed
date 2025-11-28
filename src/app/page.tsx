"use client";
import { GoArrowRight, GoZap, GoShieldCheck, GoPeople } from "react-icons/go";
import SpotlightCard from "@/components/SpotlightCard";
import { AnimatedTooltipPreview } from "@/components/AnimatedTooltipPreview";
import { TeamCarousel, type TeamMember } from "@/components/ui/team-carousel";
import RippleButton from "@/components/ui/ripple-button";
import Image from "next/image"; // Assuming you have an Image component
import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import HotelIcon from '@mui/icons-material/Hotel';
import RepeatIcon from '@mui/icons-material/Repeat';
import { TimelineSeparator } from "@mui/lab";
import Typography from '@mui/material/Typography';

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    role: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  },
  {
    id: "2",
    name: "Robert Johnson",
    role: "Product Manager",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "3",
    name: "Jane Smith",
    role: "Data Scientist",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "4",
    name: "Emily Davis",
    role: "UX Designer",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "5",
    name: "Tyler Durden",
    role: "Soap Developer",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  },
];

export default function Home() {
  return <main>
    {/* Hero Section */}
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Background Grid */}
      <div className="absolute inset-0 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      {/* Spotlight Effect */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Expert Online Tutoring
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">
          Begin your academic adventure with us at Tuitioned, where each step leads to personal and academic growth. Our dedicated educators are here to guide you, providing the support needed for academic success. 🎉
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a href="/get-a-free-tail">
            <RippleButton className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 transform hover:scale-105">
              <span className="flex items-center">
                Get a Free Trial
                <GoArrowRight className="ml-2" />
              </span>
            </RippleButton>
          </a>
        </div>
      </div>

      {/* Animated Avatars at the bottom */}
      <div className="absolute bottom-10 flex flex-row items-center justify-center w-full">
        <AnimatedTooltipPreview />
      </div>
    </section>

    {/* Features Section */}
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="max-w-2xl mx-auto lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-500">Why Choose Tuitioned?</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            A Better Learning Experience
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our platform is designed to provide a seamless learning experience with powerful tools for both students and educators.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">

            {/* SpotlightCard 1 */}
            <SpotlightCard
              spotlightColor="rgba(59, 130, 246, 0.2)"
              className="relative h-full bg-gray-800 border border-blue-500 rounded-2xl shadow-[0_0_25px_rgba(59,130,246,0.2)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.35)] hover:scale-[1.03] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-blue-500/10 before:to-transparent before:animate-pulse"
            >
              <div className="flex flex-col h-full p-6 relative z-10">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                  <GoZap className="h-5 w-5 flex-none text-blue-500" aria-hidden="true" />
                  Tailored Learning
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    When you join Tuitioned, you’re not just enrolling in a course, you’re becoming part of a community.
                    Engage with fellow learners, participate in discussions, and grow together! Want a taste of our community spirit?
                    It’s all in our demo session!
                  </p>
                </dd>
              </div>
            </SpotlightCard>

            {/* SpotlightCard 2 */}
            <SpotlightCard
              spotlightColor="rgba(59, 130, 246, 0.2)"
              className="relative h-full bg-gray-800 border border-blue-500 rounded-2xl shadow-[0_0_25px_rgba(59,130,246,0.2)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.35)] hover:scale-[1.03] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-blue-500/10 before:to-transparent before:animate-pulse"
            >
              <div className="flex flex-col h-full p-6 relative z-10">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                  <GoShieldCheck className="h-5 w-5 flex-none text-blue-500" aria-hidden="true" />
                  Expert Guidance
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    Our experienced professionals are not just teachers, they’re mentors who are dedicated to your success.
                    Want a sneak peek of their expertise? Join our demo session!
                  </p>
                </dd>
              </div>
            </SpotlightCard>

            {/* SpotlightCard 3 */}
            <SpotlightCard
              spotlightColor="rgba(59, 130, 246, 0.2)"
              className="relative h-full bg-gray-800 border border-blue-500 rounded-2xl shadow-[0_0_25px_rgba(59,130,246,0.2)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.35)] hover:scale-[1.03] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-blue-500/10 before:to-transparent before:animate-pulse"
            >
              <div className="flex flex-col h-full p-6 relative z-10">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                  <GoPeople className="h-5 w-5 flex-none text-blue-500" aria-hidden="true" />
                  Community Engagement
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    When you join Tuitioned, you’re not just enrolling in a course, you’re becoming part of a community.
                    Engage with fellow learners, participate in discussions, and grow together!
                  </p>
                </dd>
              </div>
            </SpotlightCard>

          </dl>
        </div>
      </div>
    </section>


    {/* Team Carousel Section */}
    <section className="py-20 sm:py-32">
      <TeamCarousel members={teamMembers} title="Tuitioned's Rising Stars" titleClassName="text-5xl" />
    </section>

    {/* Image and Timeline Section */}
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="max-w-2xl mx-auto lg:text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-blue-500">How It Works</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            A Glimpse Into Our Process
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div className="aspect-video rounded-lg overflow-hidden relative">
            <Image
              className="w-full h-full"
              src="/home1.png"
              alt="A glimpse into our process"
              layout="fill"
              objectFit="cover"
            />
          </div>

          {/* Timeline */}
          <div>
            <Timeline position="alternate">
              <TimelineItem>
                <TimelineOppositeContent sx={{ m: 'auto 0' }} align="right" variant="body2" color="text.secondary">
                  9:30 am
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineConnector />
                  <TimelineDot>
                    <FastfoodIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Typography variant="h6" component="span">
                    Eat
                  </Typography>
                  <Typography>Because you need strength</Typography>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineOppositeContent sx={{ m: 'auto 0' }} variant="body2" color="text.secondary">
                  10:00 am
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineConnector />
                  <TimelineDot color="primary">
                    <LaptopMacIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Typography variant="h6" component="span">
                    Code
                  </Typography>
                  <Typography>Because it&apos;s awesome!</Typography>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineConnector />
                  <TimelineDot color="primary" variant="outlined">
                    <HotelIcon />
                  </TimelineDot>
                  <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Typography variant="h6" component="span">
                    Sleep
                  </Typography>
                  <Typography>Because you need rest</Typography>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
                  <TimelineDot color="secondary">
                    <RepeatIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Typography variant="h6" component="span">
                    Repeat
                  </Typography>
                  <Typography>Because this is the life you love!</Typography>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </div>
        </div>
      </div>
    </section>

    {/* Testimonials Section */}
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-blue-500">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by learners worldwide
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <SpotlightCard className="bg-gray-800 border border-blue-500">
              <blockquote className="p-8 h-full">
                <p className="text-lg text-muted-foreground">"This platform transformed the way I learn. The interactive lessons and expert feedback are invaluable. I've progressed more in the last 3 months than I did in 3 years of self-study."</p>
                <footer className="mt-6">
                  <p className="font-semibold">Alex Johnson</p>
                  <p className="text-sm text-muted-foreground">Web Development Student</p>
                </footer>
              </blockquote>
            </SpotlightCard>
            <SpotlightCard className="bg-gray-800 border border-blue-500">
              <blockquote className="p-8 h-full">
                <p className="text-lg text-muted-foreground">"As an educator, I'm always looking for tools that make teaching more effective. The community features and progress tracking have made my job so much easier and more rewarding."</p>
                <footer className="mt-6">
                  <p className="font-semibold">Maria Garcia</p>
                  <p className="text-sm text-muted-foreground">University Professor</p>
                </footer>
              </blockquote>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>

    {/* Animated Tooltip Section */}
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="max-w-2xl mx-auto lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-500">Our Tutors</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">The Experts Behind Your Success</p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our dedicated team of educators and professionals are here to guide you on your learning journey.
          </p>
        </div>
        <div className="mt-16 flex flex-row items-center justify-center">
          <AnimatedTooltipPreview />
        </div>
      </div>
    </section>
  </main>;
}
