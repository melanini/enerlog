import { useState } from 'react';
import { Smartphone, Watch, CheckCircle, XCircle, Settings } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function ConnectionStatus() {
  const [appleHealthConnected, setAppleHealthConnected] = useState(false);
  const [wearableConnected, setWearableConnected] = useState(false);

  const handleConnectAppleHealth = () => {
    // In a real app, this would trigger Apple Health integration
    setAppleHealthConnected(!appleHealthConnected);
  };

  const handleConnectWearable = () => {
    // In a real app, this would trigger wearable device pairing
    setWearableConnected(!wearableConnected);
  };

  return (
    <Card className="border-0 shadow-sm bg-card/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Settings className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Device Connections</h3>
            <p className="text-sm text-muted-foreground">Auto-sync sleep and activity data</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Apple Health */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-foreground">Apple Health</h4>
                <p className="text-sm text-muted-foreground">Sleep quality, steps, heart rate</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {appleHealthConnected ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                  <XCircle className="h-3 w-3 mr-1" />
                  Disconnected
                </Badge>
              )}
              <Button
                size="sm"
                variant={appleHealthConnected ? "outline" : "default"}
                onClick={handleConnectAppleHealth}
                className="text-xs"
              >
                {appleHealthConnected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          </div>

          {/* Wearables */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Watch className="h-5 w-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-foreground">Wearable Device</h4>
                <p className="text-sm text-muted-foreground">Sleep stages, activity tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {wearableConnected ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                  <XCircle className="h-3 w-3 mr-1" />
                  Disconnected
                </Badge>
              )}
              <Button
                size="sm"
                variant={wearableConnected ? "outline" : "default"}
                onClick={handleConnectWearable}
                className="text-xs"
              >
                {wearableConnected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          </div>
        </div>

        {(appleHealthConnected || wearableConnected) && (
          <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200/50">
            <p className="text-sm text-green-800">
              ✨ Sleep quality will be automatically updated from your connected devices tomorrow morning.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}