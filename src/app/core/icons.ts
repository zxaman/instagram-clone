/**
 * Central registry of Lucide icons used in the app.
 * Import icons from this file in components so we can track usage in one place.
 *
 * Usage in component:
 *   import { LucideAngularModule } from 'lucide-angular';
 *   import { Heart, MessageCircle } from './core/icons';
 *   // Expose on class: readonly Heart = Heart;
 *   // Template: <lucide-icon [img]="Heart" [size]="24"></lucide-icon>
 */

export {
  // Post / feed
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  BadgeCheck,
  // Left sidebar (nav + logo)
  Camera,
  Home,
  Clapperboard,
  Search,
  Compass,
  SquarePlus,
  User,
  // Stories (strip + viewer)
  ChevronLeft,
  ChevronRight,
  X,
  CheckCheck,
  // Messages
  PenSquare,
  Info,
  Phone,
  Video,
  Image,
  Smile,
  ChevronUp,
  ChevronDown,
} from 'lucide-angular';

/** List of icon names in use – for documentation and tracking. */
export const ICONS_IN_USE = [
  'Heart',
  'MessageCircle',
  'Send',
  'Bookmark',
  'MoreHorizontal',
  'BadgeCheck',
  'Camera',
  'Home',
  'Clapperboard',
  'Search',
  'Compass',
  'SquarePlus',
  'User',
  'ChevronLeft',
  'ChevronRight',
  'X',
  'CheckCheck',
  'PenSquare',
  'Info',
  'Phone',
  'Video',
  'Image',
  'Smile',
  'ChevronUp',
  'ChevronDown',
] as const;
