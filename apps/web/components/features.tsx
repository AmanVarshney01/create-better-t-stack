import { Cards, Card } from "fumadocs-ui/components/card";
import {
  Database,
  Package,
  Lock,
  Globe,
  Server,
  Cable,
  Atom,
  Terminal,
} from "lucide-react";

export default function Features() {
  return (
    <Cards>
      <Card
        icon={<Terminal />}
        title='Zero Config Setup'
        description='No need to configure anything with the interactive CLI wizard'
      />
      <Card
        icon={<Atom />}
        title='Modern Frontend'
        description='Choose between Tanstack Router, React Router, Expo, Next.js, and more'
      />
      <Card
        icon={<Globe />}
        title='Multi-Platform'
        description='Better-T Stack supports web, mobile, and desktop'
      />
      <Card
        icon={<Server />}
        title='Flexible Backend'
        description='Choose between Hono, Elysia, Next.js and Express'
      />
      <Card
        icon={<Cable />}
        title='End to end typesafe APIs'
        description='With the help of tRPC or oRPC'
      />
      <Card
        icon={<Lock />}
        title='Authentication'
        description='With the help of Better Auth'
      />
      <Card
        icon={<Database />}
        title='Database Setup'
        description='Many ORMs and Relational Databases'
      />
      <Card
        icon={<Package />}
        title='Addons'
        description='Add PWA support, desktop apps, documentation, and more'
      />
    </Cards>
  );
}
