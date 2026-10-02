import { UserRole } from '@bis/shared-types';

export const SEED_USERS = [
  {
    email: 'procurement.officer@gem.gov.in',
    passwordHash: '$2a$10$w8T0MhNfR4p8z9D8S5WkAeA2Z6iY9jT0V7q1u2x3y4z5a6b7c8d9e',
    fullName: 'Shri Vikram Malhotra',
    role: UserRole.PROCUREMENT_OFFICER,
    organization: 'Government e-Marketplace (GeM) / Ministry of Commerce',
    designation: 'Senior Procurement Director',
    preferredLanguage: 'en'
  },
  {
    email: 'buyer.ntpc@ntpc.co.in',
    passwordHash: '$2a$10$w8T0MhNfR4p8z9D8S5WkAeA2Z6iY9jT0V7q1u2x3y4z5a6b7c8d9e',
    fullName: 'Ananya Sharma',
    role: UserRole.BUYER_GEM,
    organization: 'NTPC Renewable Energy Division',
    designation: 'General Manager (Tendering & Contracts)',
    preferredLanguage: 'en'
  },
  {
    email: 'qa.engineer@cpwd.gov.in',
    passwordHash: '$2a$10$w8T0MhNfR4p8z9D8S5WkAeA2Z6iY9jT0V7q1u2x3y4z5a6b7c8d9e',
    fullName: 'Rajesh Verma',
    role: UserRole.QA_ENGINEER,
    organization: 'CPWD Quality Assurance Wing',
    designation: 'Superintending Quality Assurance Engineer',
    preferredLanguage: 'hi'
  },
  {
    email: 'bidder.supplier@indiatenders.in',
    passwordHash: '$2a$10$w8T0MhNfR4p8z9D8S5WkAeA2Z6iY9jT0V7q1u2x3y4z5a6b7c8d9e',
    fullName: 'Amitabh Sen',
    role: UserRole.BIDDER_SUPPLIER,
    organization: 'Bharat Infrastructure Suppliers Consortium',
    designation: 'Tender Bidding & Compliance Lead',
    preferredLanguage: 'en'
  },
  {
    email: 'admin.bis@example.gov.in',
    passwordHash: '$2a$10$w8T0MhNfR4p8z9D8S5WkAeA2Z6iY9jT0V7q1u2x3y4z5a6b7c8d9e',
    fullName: 'BIS Procurement System Administrator',
    role: UserRole.ADMIN,
    organization: 'Bureau of Indian Standards & GeM Division',
    designation: 'Chief Procurement Standards Architect',
    preferredLanguage: 'en'
  }
];
