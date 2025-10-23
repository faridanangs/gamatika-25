'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import {
  Award,
  Star,
  Trophy,
  Zap,
  Target,
  BookOpen,
  Calendar,
  CheckCircle,
  Sparkles,
  Crown,
  Medal,
  Rocket,
} from 'lucide-react';

const achievementIcons = {
  'Top Contributor': <Crown className="h-6 w-6 text-yellow-600" />,
  'Top Problem Solver': <Medal className="h-6 w-6 text-pink-500" />,
  default: <Trophy className="h-6 w-6 text-gray-500" />,
};

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: {
    scale: 1.05,
    boxShadow:
      '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
};

const AchievementCard = ({ achievement, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get icon based on achievement name
  const IconComponent =
    achievementIcons[achievement] || achievementIcons.default;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      <Card className="h-full flex flex-col items-center justify-center p-4 transition-all duration-300 overflow-hidden border-2 border-transparent dark:border-[1px] dark:shadow-sm dark:shadow-amber-50 hover:border-indigo-200 group">
        <div className="relative z-10 mb-3">
          <div
            className={`p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 ${
              isHovered ? 'shadow-lg scale-110' : ''
            }`}
          >
            {IconComponent}
          </div>
          {isHovered && (
            <div className="absolute inset-0 rounded-full bg-indigo-200 opacity-30 blur-md" />
          )}
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-sm font-medium text-center line-clamp-2 mb-2 relative z-10">
                {achievement}
              </p>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-white/90 backdrop-blur-sm border border-indigo-100 text-black"
            >
              <p className="font-medium">{achievement}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="mt-auto relative z-10">
          <Badge variant="secondary" className="text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            Baru
          </Badge>
        </div>
      </Card>
    </motion.div>
  );
};

const AchievementSection = ({ user }) => {
  const achievements = Array.isArray(user?.achievements)
    ? user.achievements
    : user?.achievements
    ? JSON.parse(user.achievements)
    : [];

  return (
    <Card className="w-full shadow-lg border-0  dark:bg-card dark:shadow-amber-50 dark:shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
            <Award className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Penghargaan
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Penghargaan yang Anda dapatkan
              <span className="ml-2 text-xs bg-gradient-to-r text-white font-bold px-2 py-1 rounded-full from-indigo-500 to-purple-500">
                {achievements.length} penghargaan
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3 ">
            {achievements.map((achievement, index) => (
              <AchievementCard
                key={index}
                achievement={achievement}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-4 p-4 rounded-full bg-indigo-50">
              <Trophy className="h-10 w-10 text-indigo-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2 dark:text-gray-200">
              Belum ada penghargaan
            </h3>
            <p className="text-gray-500 max-w-md dark:text-gray-500">
              Lakukan aktivitas di platform untuk mendapatkan penghargaan
              pertama Anda
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementSection;
