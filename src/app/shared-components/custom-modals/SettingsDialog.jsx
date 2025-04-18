import {
  Bell,
  Check,
  Globe,
  Home,
  Keyboard,
  Link,
  MenuIcon,
  MessageCircle,
  Paintbrush,
  Settings,
  Video,
  Lock,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Breadcrumbs,
  Typography,
} from "@mui/material"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"

const data = {
  nav: [
    { name: "Notifications", icon: Bell },
    { name: "Navigation", icon: MenuIcon },
    { name: "Home", icon: Home },
    { name: "Appearance", icon: Paintbrush },
    { name: "Messages & media", icon: MessageCircle },
    { name: "Language & region", icon: Globe },
    { name: "Accessibility", icon: Keyboard },
    { name: "Mark as read", icon: Check },
    { name: "Audio & video", icon: Video },
    { name: "Connected accounts", icon: Link },
    { name: "Privacy & visibility", icon: Lock },
    { name: "Advanced", icon: Settings },
  ],
}

export function SettingsDialog() {
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <>
      <Button variant="contained" size="small" onClick={handleOpen} className="bg-primary hover:bg-primary/90">
        Open Dialog
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth className="overflow-hidden">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogContent className="p-0 flex h-[500px] overflow-hidden">
          {/* Sidebar */}
          <Drawer
            variant="permanent"
            anchor="left"
            className="hidden md:block"
            sx={{
              width: 240,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                position: "relative",
                width: 240,
                boxSizing: "border-box",
                border: "none",
              },
            }}
          >
            <List className="py-2">
              {data.nav.map((item) => (
                <ListItem key={item.name} disablePadding>
                  <ListItemButton
                    className={`rounded-md my-1 mx-2 ${item.name === "Messages & media" ? "bg-primary/10 text-primary" : ""}`}
                  >
                    <ListItemIcon
                      className={`min-w-8 ${item.name === "Messages & media" ? "text-primary" : "text-gray-500"}`}
                    >
                      <item.icon size={20} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      className={`${item.name === "Messages & media" ? "text-primary" : ""}`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Drawer>

          {/* Main Content */}
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200">
              <div className="flex items-center gap-2 px-4">
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                  <Typography
                    color="inherit"
                    className="hidden md:block text-gray-600 hover:text-primary hover:underline cursor-pointer"
                  >
                    Settings
                  </Typography>
                  <Typography color="text.primary">Messages & media</Typography>
                </Breadcrumbs>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-video max-w-3xl rounded-xl bg-gray-100" />
              ))}
            </div>
          </main>
        </DialogContent>
      </Dialog>
    </>
  )
}

