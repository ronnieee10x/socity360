# Society360 — React Native / Expo Mobile Application

Society360 provides a native cross-platform mobile client for Android and iOS designed for on-the-go resident services and ground-staff operations.

## Architecture & Features

The mobile app shares the exact same REST API backend as the web client:
1. **Resident Fast-Track Gate Pass**:
   - Generates 6-digit visitor passcodes with 1 tap.
   - Pre-approves guests, delivery agents, and cabs.
2. **Security Guard Gate Terminal**:
   - Fast numeric passcode entry & verification.
   - 1-touch visitor check-in and checkout log.
3. **Field Maintenance Technician Tasks**:
   - Mobile work order queue.
   - 1-tap "Start Work" (onsite) and "Mark Resolved" with service notes.
4. **Resident Maintenance Dues & Digital Payments**:
   - Monthly assessment bill viewer.
   - Simulated UPI / Card payments with instant digital receipt.

## Setup & Running with Expo

```bash
cd mobile
npm install
npm start
```

- Press `a` to launch in Android Emulator.
- Press `i` to launch in iOS Simulator.
- Scan QR code using Expo Go app on physical Android/iOS devices.

## API Endpoint Configuration

Edit `mobile/src/services/api.ts` to point to your backend:
- Android Emulator: `http://10.0.2.2:8080/api`
- Physical Device (LAN): `http://<YOUR_COMPUTER_IP>:8080/api`
