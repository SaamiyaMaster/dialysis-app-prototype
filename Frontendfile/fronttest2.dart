import 'package:flutter/material.dart';

//import 'second page.art'; //to import the second page.dart file

class TypeBPM extends StatefulWidget {
  const TypeBPM({super.key});

  @override
  State<TypeBPM> createState() => _TypeBPMState();
}

class _TypeBPMState extends State<TypeBPM> {
  int? BPM;

  @override
  void dispose() {
    BPM = null  ;
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const cream = Color(0xFFFFF9EA);
    const purple = Color(0xFF80618E);
    const lavender = Color(0xFFDAC8EA);
    const darkText = Color(0xFF3C3044);
    const yellow = Color(0xFFF7DEA0);

    return Scaffold(
      backgroundColor: lavender,
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 480),
            child: Container(
              width: double.infinity,
              height: double.infinity,
              decoration: BoxDecoration(
                color: cream,
                borderRadius: BorderRadius.circular(28),
              ),
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        IconButton(
                          onPressed: () => Navigator.pop(context),
                          icon: const Icon(Icons.arrow_back),
                        ),
                        const Expanded(
                          child: Center(
                            child: Text(
                              '💧 Dwell',
                              style: TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                                color: purple,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 48),
                      ],
                    ),


                    const Text('Enter BPM'),
                    const SizedBox(height: 8),
                    TextField(
                       keyboardType: TextInputType.number, //show number keyboard
                      inputFormatters: [
                          FilteringTextInputFormatter.digitsOnly,
                        ], //only allow digits
                      controller: BPM,
                      decoration: _inputDecoration('Your BPM'),
                    ),

                    const SizedBox(height: 20),


                  

                    const SizedBox(height: 24),

                    const Center(
                      child: Text(
                        'Your health information is private and stays securely protected.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Color(0xFF82939A),
                          fontSize: 11,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  InputDecoration _inputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      filled: true,
      fillColor: Colors.white,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: Color(0xFFDAC8EA)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: Color(0xFFDAC8EA)),
      ),
    );
  }
}