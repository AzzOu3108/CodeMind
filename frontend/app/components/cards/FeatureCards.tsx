import { LaptopIcon, LockSimpleOpenIcon } from '@phosphor-icons/react'
import { Map, WorkflowIcon } from 'lucide-react'
import React from 'react'
import Cards from './Cards'


const features = [
    {
        title: "AI-Personalized Roadmap",
        description: "Get a customized learning path tailored to your goals and skill level with AI.",
        icon:<Map size={28}/>
    },

    {
        title: "Totally Free",
        description: "No subscriptions. No paywalls. Just completely free access to high-quality programming education",
        icon:<LockSimpleOpenIcon size={28}  />
    },

    {
        title: "Learn Anytime, Anywhere",
        description: "Access your courses anytime, on any device. Your progress is synced everywhere, so you can learn whenever inspiration strikes.",
        icon:<LaptopIcon size={30} />
    },

    {
        title: "Algorithm Mastery",
        description: "Learn algorithms and data structures with simple visuals, real examples, and clear AI guidance.",
        icon:<WorkflowIcon size={28}/>
    },
]


export default function FeatureCards() {
    return(
        <div className='md:flex md:justify-end md:absolute md:top-10'>
        <div className='w-full md:w-3/5 grid gap-6 grid-cols-2  auto-rows-auto'>
            {features.map((feature, index) => (
                <Cards
                    key={index}
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    className={index % 2 === 1 ? "md:translate-y-4" : ""}
                    iconBackground = {true}
                />
            ))}
        </div>
        </div>
    )
}
