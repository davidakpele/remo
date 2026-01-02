import { Service } from "../types/utils";
import { 
  Smartphone, 
  Wifi, 
  Tv, 
  Lightbulb, 
  CreditCard, 
  Hospital, 
  Trophy, 
  RefreshCw, 
  Plane, 
  ShoppingBag,
  Search
} from 'lucide-react';


export const services: Service[] = [
    {
      id: '1',
      name: 'Buy Airtime',
      icon: <Smartphone className="w-8 h-8" />,
      color: 'bg-orange-400',
      category: 'mobile'
    },
    {
      id: '2',
      name: 'Buy Data',
      icon: <Wifi className="w-8 h-8" />,
      color: 'bg-teal-400',
      category: 'mobile'
    },
    {
      id: '3',
      name: 'CableTV',
      icon: <Tv className="w-8 h-8" />,
      color: 'bg-blue-400',
      category: 'entertainment'
    },
    {
      id: '4',
      name: 'Electricity',
      icon: <Lightbulb className="w-8 h-8" />,
      color: 'bg-orange-300',
      category: 'utilities'
    },
    {
      id: '5',
      name: 'Virtual Card',
      icon: <CreditCard className="w-8 h-8" />,
      color: 'bg-green-300',
      category: 'financial'
    },
    {
      id: '6',
      name: 'Hospital',
      icon: <Hospital className="w-8 h-8" />,
      color: 'bg-yellow-400',
      category: 'health'
    },
    {
      id: '7',
      name: 'Betting',
      icon: <Trophy className="w-8 h-8" />,
      color: 'bg-purple-300',
      category: 'entertainment'
    },
    {
      id: '8',
      name: 'Swap',
      icon: <RefreshCw className="w-8 h-8" />,
      color: 'bg-blue-300',
      category: 'financial'
    },
    {
      id: '9',
      name: 'Book Flight',
      icon: <Plane className="w-8 h-8" />,
      color: 'bg-yellow-300',
      category: 'travel'
    },
    {
      id: '10',
      name: 'Shopping',
      icon: <ShoppingBag className="w-8 h-8" />,
      color: 'bg-green-400',
      category: 'shopping'
    }
  ];

export const filters = [
    { id: 'all', label: 'All Services' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'utilities', label: 'Utilities' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'financial', label: 'Financial' },
    { id: 'health', label: 'Health' },
    { id: 'travel', label: 'Travel' },
    { id: 'shopping', label: 'Shopping' }
  ];
