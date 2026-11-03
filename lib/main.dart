import 'package:flutter/material.dart';
import 'screens/signup_screen.dart';

void main() {
  runApp(const DwellApp());
}

class DwellApp extends StatelessWidget {
  const DwellApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Dwell',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        fontFamily: 'Arial',
      ),
      home: const WelcomeScreen(),
    );
  }
}

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const lavender = Color(0xFFDAC8EA);
    const purple = Color(0xFF80618E);
    const darkText = Color(0xFF3C3044);
    const green = Color(0xFFCDE9C5);

    return Scaffold(
      backgroundColor: lavender,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: 24,
            vertical: 24,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // App name
              Row(
                children: [
                  const Icon(
                    Icons.water_drop,
                    color: purple,
                    size: 22,
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    'Dwell',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: darkText,
                    ),
                  ),
                  const Spacer(),
                  const Text(
                    'YOUR TREATMENT COMPANION',
                    style: TextStyle(
                      fontSize: 9,
                      letterSpacing: 1,
                      color: purple,
                    ),
                  ),
                ],
              ),

              const Spacer(),

              // Center illustration
              Center(
                child: Container(
                  width: 180,
                  height: 180,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: purple.withValues(alpha: 0.25),
                    ),
                  ),
                  child: Center(
                    child: Container(
                      width: 130,
                      height: 130,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: purple.withValues(alpha: 0.3),
                        ),
                      ),
                      child: Center(
                        child: Container(
                          width: 95,
                          height: 95,
                          decoration: const BoxDecoration(
                            color: Color(0xFFF7DEA0),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.water_drop,
                            color: purple,
                            size: 48,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 60),

              const Text(
                'CARE THAT STAYS WITH YOU',
                style: TextStyle(
                  color: purple,
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.5,
                ),
              ),

              const SizedBox(height: 12),

              const Text(
                'Your dialysis\njourney, made a\nlittle lighter.',
                style: TextStyle(
                  color: darkText,
                  fontSize: 36,
                  height: 1.1,
                  fontWeight: FontWeight.bold,
                ),
              ),

              const SizedBox(height: 16),

              const Text(
                'Track treatments, notice patterns, and keep your care '
                'information in one calm place.',
                style: TextStyle(
                  color: Color(0xFF665571),
                  fontSize: 15,
                  height: 1.5,
                ),
              ),

              const Spacer(),

              // Get started button
              SizedBox(
                width: double.infinity,
                height: 54,
                child: ElevatedButton(
                 onPressed: () {
  Navigator.push(
    context,
    MaterialPageRoute(
      builder: (context) => const SignupScreen(),
    ),
  );
},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: green,
                    foregroundColor: darkText,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Get started',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Icon(Icons.arrow_forward),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 18),

              Center(
                child: TextButton(
                  onPressed: () {
                    // Login screen will be added later.
                  },
                  child: const Text(
                    'I already have an account',
                    style: TextStyle(
                      color: darkText,
                      fontSize: 13,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}