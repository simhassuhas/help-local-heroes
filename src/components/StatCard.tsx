
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: number;
  icon?: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, change, icon, className }) => {
  const getChangeColor = () => {
    if (!change) return 'text-muted-foreground';
    return change > 0 ? 'text-green-600' : 'text-red-600';
  };
  
  const getChangeIcon = () => {
    if (!change) return null;
    return change > 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };
  
  return (
    <Card className={cn(className)}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className="flex items-baseline space-x-2">
          <h3 className="text-2xl font-bold">{value}</h3>
          {change !== undefined && (
            <span className={cn("flex items-center text-sm", getChangeColor())}>
              {getChangeIcon()}
              <span>{Math.abs(change)}%</span>
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
