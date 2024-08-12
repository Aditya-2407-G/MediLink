  
# MediLink

MediLink is a real-time application that allows users to view doctors in their vicinity and book appointments with specialists from the convenience of their homes. The app provides users with a highly intuitive experience, making the appointment process as seamless as possible.


**Figma:** - https://www.figma.com/design/27CFrLnvMLducPEU7TgqD4/Mobile-Design?node-id=0-1&t=j98vfZDnc0CHhaLq-1 


**APK:** - https://drive.google.com/file/d/1YCcOIzjauilcGymZvrAq3rs5nFouSCp5/view?usp=sharing


*(The server takes 1 to 2 minutes to load on inital request so, it might take a while to process your first request.)*


Key Features:

* Find Availability: Users can search for doctors based on their specialty and view available appointment slots.
* Location-Based Search: The app allows users to find doctors near their location, sorting the list based on the shortest distance.
* Appointment Booking: Users can book appointments and receive confirmation notifications within the app.
* Conflict-Free Scheduling: The app ensures there are no conflicting consultations for doctors or patients at the booked time slots.
* Reminder Notifications: Users receive a reminder notification 1 hour before the appointment time, with a link to driving directions to the doctor's clinic. Clicking the notification provides instant directions to the hospital.


MediLink also offers location and direction services to help users easily navigate to the doctor's office. The app’s notification system ensures users are reminded of their upcoming appointments, providing a link to driving directions for added convenience.

This project is developed as part of the Veersa Technologies Hackathon competition with the aim of transforming healthcare through technological innovation. The submission is made by students of Maharaja Surajmal Institute of Technology, New Delhi.



## Demo


<a href="https://res.cloudinary.com/dddnk0dcn/video/upload/v1723397223/WhatsApp_Video_2024-08-11_at_22.56.29_bcf80560_yxcztd.mp4" target="_blank">
  <img src="https://res.cloudinary.com/dddnk0dcn/image/upload/v1723394889/WhatsApp_Image_2024-08-11_at_22.15.53_f48e21c6_cnelsg.jpg" alt="Watch the video" width="200"/>
</a>


## Data Model

![ER Model](https://github.com/user-attachments/assets/599f192a-3acf-43e6-b89e-f070b634db5a)



## Tech Stack


**Client:** React-Native, Expo, TailwindCSS

**Server:** Node, Express, Mongoose

**Storage:** MongoDB Atlas

**Navigation:** Google Maps API

**Vector Search:** Hugging face inference API

**Testing:** Postman


## What We Learned

**Concurrent Bookings:** Ensured no two concurrent bookings occurred at the same time by implementing multiple checks at the backend.

**New Tools:** Gained experience with Expo Calendar, push notifications with links, and geolocation, which were new to us.

**Enhanced Search Functionality:** Incorporated vector search or semantic search to improve search results and user experience. (AI Seek feature)

**Design Tools:** We worked with Figma, which, while requiring creativity, facilitated a smoother and simpler development process by providing clear design guidelines.

**Task Management**: Efficiently managed high workloads through clear task division among team members.

**Project Planning:** Learned to create and follow a project plan or timeline to ensure smooth workflow, efficient management, and increased productivity.


## Screenshots

<table>
  <tr>
    <td><img src="https://res.cloudinary.com/dddnk0dcn/image/upload/v1723390975/WhatsApp_Image_2024-08-11_at_02.54.59_41fb2204_m3393m.jpg" alt="Onboarding Screen 1" width="200"/></td>
    <td><img src="https://res.cloudinary.com/dddnk0dcn/image/upload/v1723390982/WhatsApp_Image_2024-08-11_at_02.54.59_a0ced8bb_hr2sn0.jpg" alt="Onboarding Screen 2" width="200"/></td>
    <td><img src="https://res.cloudinary.com/dddnk0dcn/image/upload/v1723390987/WhatsApp_Image_2024-08-11_at_02.54.59_f437646f_dkolf0.jpg" alt="Onboarding Screen 3" width="200"/></td>
  </tr>
  <tr>
    <td>Onboarding Screen 1</td>
    <td>Onboarding Screen 2</td>
    <td>Onboarding Screen 3</td>
  </tr>
</table>

<table>
  <tr>
    <td><img src="https://res.cloudinary.com/dddnk0dcn/image/upload/v1723393884/WhatsApp_Image_2024-08-11_at_22.01.03_f25a9de1_ysced5.jpg" alt="Sign Up (Patient)" width="200"/></td>
    <td><img src="https://res.cloudinary.com/dddnk0dcn/image/upload/v1723393889/WhatsApp_Image_2024-08-11_at_22.01.03_4460bcdb_obmdp6.jpg" alt="Sign Up (Doctor) (1)" width="200"/></td>
    <td><img src="https://res.cloudinary.com/dddnk0dcn/image/upload/v1723393892/WhatsApp_Image_2024-08-11_at_22.01.03_2388122c_gmojmd.jpg" alt="Sign Up (Doctor) (2)" width="200"/></td>
  </tr>
  <tr>
    <td>Sign Up (Patient)</td>
    <td>Sign Up (Doctor) (1)</td>
    <td>Sign Up (Doctor) (2)</td>
  </tr>
</table>

<table>
  <tr>
    <td><img src="https://res.cloudinary.com/dddnk0dcn/image/upload/v1723393876/WhatsApp_Image_2024-08-11_at_22.01.02_ef540e1e_ixdpfp.jpg" alt="Sign In" width="200"/></td>
    <td><img src="https://res.cloudinary.com/dddnk0dcn/image/upload/v1723394889/WhatsApp_Image_2024-08-11_at_22.15.53_f48e21c6_cnelsg.jpg" alt="Home Page" width="200"/></td>
    <td><img src="https://res.cloudinary.com/dddnk0dcn/image/upload/v1723393928/WhatsApp_Image_2024-08-11_at_22.01.05_ad9e86b2_gpxbfe.jpg" alt="Doctor Information Page" width="200"/></td>
  </tr>
  <tr>
    <td>Sign In</td>
    <td>Home Page</td>
    <td>Doctor Information Page</td>
  </tr>
</table>

<table>
  <tr>
    <td><img src="https://res.cloudinary.com/dddnk0dcn/image/upload/v1723394881/WhatsApp_Image_2024-08-11_at_22.15.44_8a09755a_hujaav.jpg" alt="Appointment Booking Page (doctor selected)" width="200"/></td>
    <td><img src="https://res.cloudinary.com/dddnk0dcn/image/upload/v1723394883/WhatsApp_Image_2024-08-11_at_22.15.49_67774c1c_pq4cbk.jpg" alt="Appointment Booking Page (date selected)" width="200"/></td>
    <td><img src="https://res.cloudinary.com/dddnk0dcn/image/upload/v1723393904/WhatsApp_Image_2024-08-11_at_22.01.04_24b1cac6_jyaltj.jpg" alt="Appointments Page" width="200"/></td>
  </tr>
  <tr>
    <td>Appointment Booking Page (doctor selected)</td>
    <td>Appointment Booking Page (date selected)</td>
    <td>Appointments Page</td>
  </tr>
</table>

<table>
  <tr>
<td><img src="https://res.cloudinary.com/dddnk0dcn/image/upload/v1723394906/WhatsApp_Image_2024-08-11_at_22.16.00_7ed9b1b5_vlp5xe.jpg" alt="AI seek Page" width="200"/></td>
  </tr>
  <tr>
    <td>AI seek Page</td>
  </tr>
</table>


## Future Optimizations


**Enhance Booking System:** Improve the booking appointment section by reserving slots being checked out by users to prevent concurrent payments.

**Implement Payment Gateway:** Integrate a payment gateway to streamline transaction processes.

**Refine Appointment Management:** Redesign the appointment section for better user convenience, allowing users to view their appointments more effectively.

**Doctor's Appointment View:** Provide doctors with a separate view to see their daily appointments and upcoming schedules.

**Flexible Scheduling for Doctors:** Enable doctors to select their working days and hours, including options for days off.

**AI Search Enhancement:** Improve the AI search feature by expanding the dataset and increasing accuracy for better search results.

**Rescheduling Option:** Allow users to reschedule their appointments easily within the app.


## Testing

<table>
  <tr>
    <td><img src="https://res.cloudinary.com/dddnk0dcn/image/upload/v1723396557/WhatsApp_Image_2024-08-11_at_22.42.28_9572b943_drlzwu.jpg" alt="Testing Image 1" width="200"/></td>
    <td><img src="https://res.cloudinary.com/dddnk0dcn/image/upload/v1723396559/WhatsApp_Image_2024-08-11_at_22.43.07_cce5ba4d_ar9s0u.jpg" alt="Testing Image 2" width="200"/></td>
  </tr>
  <tr>
    <td>User Login</td>
    <td>User SignUp</td>
  </tr>
</table>

<table>
  <tr>
    <td><img src="https://res.cloudinary.com/dddnk0dcn/image/upload/v1723396777/WhatsApp_Image_2024-08-11_at_22.43.45_302fc65a_d61f5o.jpg" alt="Testing Image 3" width="200"/></td>
    <td><img src="https://res.cloudinary.com/dddnk0dcn/image/upload/v1723396568/WhatsApp_Image_2024-08-11_at_22.43.45_4d35ebaa_poj6o1.jpg" alt="Testing Image 4" width="200"/></td>
  </tr>
  <tr>
    <td>AI-Seek</td>
    <td>Doctor SignUp</td>
  </tr>
</table>


## Authors

- [@huhrsh](https://www.github.com/huhrsh)
- [@Aditya-2407-G](https://github.com/Aditya-2407-G)
- [@namansaini1463](https://github.com/namansaini1463)
