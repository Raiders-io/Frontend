import { SearchIcon } from "lucide-react";
import { Button } from '@/components/ui/button';
import { ButtonGroup } from "@/components/ui/button-group";
import { AvatarDropdown } from "./AvatarDropDown";
import { useEffect, useRef } from "react";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

const TopNavBar = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              placeholder="Search lesson..."
              className="w-full pl-10"
              ref={searchInputRef}
            />
            <InputGroupAddon align="inline-end">
              <KbdGroup>
                <Kbd>Ctrl</Kbd><Kbd>K</Kbd>
              </KbdGroup>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>

      <div className="flex items-center">
        <AvatarDropdown />
      </div>
    </nav>
  );
};

export default TopNavBar;
