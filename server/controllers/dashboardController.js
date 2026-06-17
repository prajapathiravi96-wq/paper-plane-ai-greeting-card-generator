import GreetingCard from '../models/GreetingCard.js';
import User from '../models/User.js';
import Analytics from '../models/Analytics.js';
import { memoryCards } from './cardController.js';
import mongoose from 'mongoose';

// Helper to check DB connection
const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Aggregate Stats for the Dashboard
export const getDashboardStats = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      // 1. Total Cards
      const totalCards = await GreetingCard.countDocuments();

      // 2. Total Users (We will seed some mock users if it's 0)
      let totalUsers = await User.countDocuments();
      if (totalUsers === 0) {
        totalUsers = 18; // default seed for display
      }

      // 3. Most Popular Occasion
      const popularOccasions = await Analytics.aggregate([
        { $group: { _id: '$occasion', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]);
      const topOccasion = popularOccasions.length > 0 ? popularOccasions[0]._id : 'N/A';

      // 4. Most Popular Tone
      const popularTones = await Analytics.aggregate([
        { $group: { _id: '$tone', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]);
      const topTone = popularTones.length > 0 ? popularTones[0]._id : 'N/A';

      // 5. Cards Generated Per Day (Last 7 Days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const cardsPerDay = await Analytics.aggregate([
        { $match: { timestamp: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Format for recharts { date: '2026-06-10', cards: 5 }
      // Ensure all last 7 days are represented even if 0 cards
      const chartDailyData = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayMatch = cardsPerDay.find(item => item._id === dateStr);
        chartDailyData.push({
          date: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          cards: dayMatch ? dayMatch.count : 0
        });
      }

      // 6. Occasion Breakdown for Pie Chart
      const occasionBreakdown = await Analytics.aggregate([
        { $group: { _id: '$occasion', count: { $sum: 1 } } }
      ]);
      const chartOccasionData = occasionBreakdown.map(item => ({
        name: item._id,
        value: item.count
      }));

      // 7. Recent Cards Activity
      const recentCards = await GreetingCard.find()
        .sort({ createdAt: -1 })
        .limit(5);

      return res.status(200).json({
        success: true,
        data: {
          cardsCount: totalCards,
          usersCount: totalUsers,
          topOccasion,
          topTone,
          chartDailyData,
          chartOccasionData,
          recentCards,
        }
      });

    } else {
      // Memory Analytics Aggregation
      const totalCards = memoryCards.length;
      const totalUsers = 24; // Mock users database size

      // Calculate popular occasion
      const occasionCounts = {};
      const toneCounts = {};
      
      memoryCards.forEach(c => {
        occasionCounts[c.occasion] = (occasionCounts[c.occasion] || 0) + 1;
        toneCounts[c.tone] = (toneCounts[c.tone] || 0) + 1;
      });

      let topOccasion = 'N/A';
      let maxOccasionCount = 0;
      Object.keys(occasionCounts).forEach(occ => {
        if (occasionCounts[occ] > maxOccasionCount) {
          maxOccasionCount = occasionCounts[occ];
          topOccasion = occ;
        }
      });

      let topTone = 'N/A';
      let maxToneCount = 0;
      Object.keys(toneCounts).forEach(t => {
        if (toneCounts[t] > maxToneCount) {
          maxToneCount = toneCounts[t];
          topTone = t;
        }
      });

      // Daily chart data (last 7 days)
      const chartDailyData = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        
        // Count cards created on this day
        const cardsOnDay = memoryCards.filter(c => {
          const cardDateStr = new Date(c.createdAt).toISOString().split('T')[0];
          return cardDateStr === dateStr;
        }).length;

        chartDailyData.push({
          date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          cards: cardsOnDay
        });
      }

      // Occasion breakdown for pie chart
      const chartOccasionData = Object.keys(occasionCounts).map(name => ({
        name,
        value: occasionCounts[name]
      }));

      // Recent Activity
      const recentCards = memoryCards.slice(0, 5);

      return res.status(200).json({
        success: true,
        data: {
          cardsCount: totalCards,
          usersCount: totalUsers,
          topOccasion,
          topTone,
          chartDailyData,
          chartOccasionData,
          recentCards,
        },
        note: "Data aggregated from temporary memory (MongoDB not connected)",
      });
    }
  } catch (error) {
    next(error);
  }
};
