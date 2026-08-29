import React, { useEffect } from "react";
import HeroSection from "./Hero/HeroSection";
import ExploreSteps from "./Steps/ExploreSteps";
import RegisterBanner from "./RegisterBanner/RegisterBanner";
import Categories from "./Category/Categories";
import LatestJobs from "./LatestJobs/LatestJobs";
import Testimonials from "./Testimonials/Testimonials";
import { useDispatch } from "react-redux";
import { fetchJobs } from "../../store/candidate/jobSlice";
import { fetchUserProfile } from "../../store/candidate/userSlice";
import { fetchCategories } from "../../store/candidate/categorySlice";

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchCategories());

    const token = localStorage.getItem("jwt");
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  return (
    <>
      <HeroSection />
      <Categories />
      <LatestJobs />
      <ExploreSteps />
      <RegisterBanner />
      <Testimonials />
    </>
  );
};

export default Home;
