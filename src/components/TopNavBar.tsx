import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { ButtonGroup } from "@/components/ui/button-group";
import { AvatarDropdown } from "./AvatarDropDown";

const TopNavBar = () => {
  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <ButtonGroup>
          <Button variant="ghost" size="icon" className="rounded-full">
            <img src="/favicon.png" alt="Logo" className="h-8 w-8" />
          </Button>
          <Button variant="ghost" className="text-lg font-semibold">
            Raiders.io
          </Button>
        </ButtonGroup>
      </div>

      <div className="flex-1 mx-8">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search lesson..."
            className="w-full pl-10"
          />
        </div>
      </div>

      <div className="flex items-center">
        <AvatarDropdown />
      </div>
    </nav>
  );
};

export default TopNavBar;
