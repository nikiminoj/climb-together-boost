-- INSERT INTO profiles (id,username,created_at) VALUES
-- (ab6028c7-a72a-4464-9e87-ec01f7c17317,niki_dev,2025-07-18T04:10:00Z),
-- (d09d001d-6e9d-4597-bc3b-f5991f7aefad,janedoe,2025-07-18T04:11:00Z),
-- (459cfafb-854c-4585-9590-fa8a346ee8d5,devkit,2025-07-18T04:12:00Z),
-- (ecfe400a-eb11-4ea9-aa8b-491408162925,aijunkie,2025-07-18T04:13:00Z),
-- (cbef089c-9e81-4540-a734-95cdbc2d7eb6,gamegod,2025-07-18T04:14:00Z),
-- (f5570ab7-9d85-4e61-9f99-d2f2480cf539,flutter_ace,2025-07-18T04:15:00Z),
-- (71146e1e-c09b-428d-90d6-1ba3515fa87b,nerdybyte,2025-07-18T04:16:00Z),
-- (ce200c9b-29a2-423a-9c96-ad75532406f8,codequeen,2025-07-18T04:17:00Z),
-- (b6953cd2-47d9-4cac-9e53-557b6593e87c,builderhub,2025-07-18T04:18:00Z),
-- (5d5b9468-462b-417d-8dcb-eb1994d0e6f7,focusme,2025-07-18T04:19:00Z);

-- INSERT INTO tags (id,name,color) VALUES
-- (201d624b-4229-4b19-9b9e-6e9ffecf2e3d,JavaScript,#f7df1e),
-- (dc9edb6c-3e7e-4e6b-a0a9-b15cb9a2d6d4,Flutter,#02569B),
-- (b0e2a609-a02c-402b-9f6d-b1de7ed6c64d,AI,#6E00FF),
-- (edc2de4b-335f-4346-8b3c-fb5ae0e7a9ed,Productivity,#00C49A),
-- (4f5462ad-28e0-491d-8ee4-2620b230bc7c,Web,#3366CC),
-- (f8de3a1b-b3fd-4c5e-8e8e-ec8dc0349d4f,Design,#FF4081),
-- (756fb9f5-c7d1-40e6-b42c-0b8b45f71f78,DevTools,#FF9800),
-- (e02c9e17-40ef-4391-91b8-8ac8b08cd191,Mobile,#009688),
-- (a1d34da9-e6cb-4ab2-879a-9c775cfa0d35,Community,#8E24AA),
-- (cf25d2ad-4ea3-4fe2-943d-5e3b91ed7716,Education,#3F51B5);



-- INSERT INTO badges (id,name,description,icon) VALUES
-- (3efba2b8-3c95-466e-b787-9e89a33b544a,Speedy,Awarded for lightning-fast execution,⚡),
-- (0ff9d85e-c823-4ca6-b825-11d4f5b94d3a,Strategist,Given for top-tier planning,🧠),
-- (1a2c748c-6d83-4534-9101-306e038e5b0b,Helper,Awarded for assisting peers,🤝),
-- (b0d6a4cc-b537-4e13-a1fa-1b49cfc3036b,Explorer,Explored 10+ tools,🧭),
-- (9bbf0d3f-02dc-4b6e-9e4b-6d09ff1ccfc0,Innovator,Launched a unique product,💡),
-- (49fc75f3-343b-4cb3-963e-2090e9388be0,Contributor,Posted multiple high-rated items,📬),
-- (2cfac13f-2b88-4c9f-9f79-b621c9288cdd,Socialite,Engaged with 10+ users,📢),
-- (cc1817b7-b499-41f4-bd63-9d3a10b7290f,Optimizer,Improved a product’s score by 30%,🎯),
-- (ea5029d7-a2f7-40e3-b3d5-57d5f9d31571,Achiever,Received 50+ upvotes,🏅),
-- (190eabdc-2c31-48e5-a685-80870ae66212,Visionary,Consistently forward-thinking,🔮);


-- INSERT INTO categories (id,name,slug,description,icon,created_at) VALUES
-- (e522b6ec-1d02-4e5e-9034-d3ab18b8f3e1,Tech,tech,All tech-related stuff,🔧,2025-07-18T04:00:00Z),
-- (7c53bb6f-8b1b-42c9-b3a6-a2e4fdc14b8f,Gaming,gaming,Games and gear,🎮,2025-07-18T04:05:00Z),
-- (a0f9ad2b-ec18-430a-8512-8d7199e1ec7a,Design,design,Creative tools and tips,🎨,2025-07-18T04:10:00Z),
-- (f146f3a7-b96f-4d60-92c7-d354d92e3512,AI,ai,Artificial intelligence tools,🤖,2025-07-18T04:15:00Z),
-- (32a05cb4-8fd0-4f98-a2ae-5d0a6f986b03,Productivity,productivity,Work smarter guides,📈,2025-07-18T04:20:00Z),
-- (a4b21964-e7c2-4e33-863e-177d06f3a4b5,Education,education,Learning resources,📚,2025-07-18T04:25:00Z),
-- (88ecb18f-b145-4429-a607-7092df4d5fcf,Mobile,mobile,Apps and platforms,📱,2025-07-18T04:30:00Z),
-- (b302e5cb-2a17-4cc0-bc3c-3c7f2ddab3f9,Web,web,Web dev resources,🌐,2025-07-18T04:35:00Z),
-- (4de8a16e-3d3c-4ef0-bac6-3f5293fbc6e3,Tools,tools,Developer tools,🛠️,2025-07-18T04:40:00Z),
-- (49c18eaf-9523-471e-b30c-735f43c1c783,Community,community,Social & collaborative,👥,2025-07-18T04:45:00Z);


-- INSERT INTO notifications (id,user_id,type,message,read,created_at,link) VALUES
-- (b8f282fd-49d1-4912-a28f-0d37a70f594e,ab6028c7-a72a-4464-9e87-ec01f7c17317,info,Your product got upvoted!,false,2025-07-18T05:00:00Z,https://speed.io),
-- (f7de9a8d-8457-4da1-9899-13cd88f11b50,d09d001d-6e9d-4597-bc3b-f5991f7aefad,reminder,Complete your profile,true,2025-07-18T05:01:00Z,https://profile.io),
-- (e1f3f802-c05b-4e81-a3a8-ef49e037e56d,459cfafb-854c-4585-9590-fa8a346ee8d5,promotion,Check out CleanUI,false,2025-07-18T05:02:00Z,https://cleanui.dev),
-- (a1808eec-1de8-498a-af27-4c1272374e8e,ecfe400a-eb11-4ea9-aa8b-491408162925,info,New comment on PromptMagic,true,2025-07-18T05:03:00Z,https://promptmagic.ai),
-- (27ec1fd2-eaac-4b52-9cd6-bbe1f8a3568b,cbef089c-9e81-4540-a734-95cdbc2d7eb6,update,FriendZone just got updated,false,2025-07-18T05:04:00Z,https://friendzone.social),
-- (fcd7f211-a592-41f7-a02f-21dc5ffdb305,f5570ab7-9d85-4e61-9f99-d2f2480cf539,info,FlutterEase reached 500 users!,true,2025-07-18T05:05:00Z,https://flutterease.dev),
-- (d61f2c1b-c1fa-4ee0-bd08-d6d3066b4693,71146e1e-c09b-428d-90d6-1ba3515fa87b,warning,ToolboxX needs verification,false,2025-07-18T05:06:00Z,https://toolboxx.dev),
-- (d3a3b1cb-e62a-4ff6-96b8-efbb83e4e6b6,ce200c9b-29a2-423a-9c96-ad75532406f8,info,TutorBot added new topics,true,2025-07-18T05:07:00Z,https://tutorbot.ai),
-- (eb5e3f9f-228b-4aa7-8e5b-badcbcf942e8,b6953cd2-47d9-4cac-9e53-557b6593e87c,promotion,Get 50% off WebScout,false,2025-07-18T05:08:00Z,https://webscout.io),
-- (a63f54a7-35aa-48ec-a735-e11212cc3512,5d5b9468-462b-417d-8dcb-eb1994d0e6f7,reminder,FocusApp session overdue,true,2025-07-18T05:09:00Z,https://focus.app);


-- INSERT INTO products (id,name,description,image,author,points,upvotes,badges,category,link,peer_push_points,user_id,created_at,updated_at) VALUES
-- (bddf5b71-7e21-44cc-b798-b12a66746b07,Speed Booster,Improves performance,speed.png,niki_dev,12,30,"speedy,top",tech,https://speed.io,5,ab6028c7-a72a-4464-9e87-ec01f7c17317,2025-07-18T04:20:00Z,2025-07-18T04:21:00Z),
-- (c4d4dd8b-b947-470b-a5e5-517dbdbf371d,XP Amplifier,Increases EXP gain,xp.png,janedoe,5,12,"rare,elite",education,https://xpboost.io,3,d09d001d-6e9d-4597-bc3b-f5991f7aefad,2025-07-18T04:22:00Z,2025-07-18T04:23:00Z),
-- (5d5095a6-070b-40d9-a79c-3e0ec0dba8a9,CleanUI,Minimal design tools,ui.png,devkit,15,20,"sleek,design",design,https://cleanui.dev,2,459cfafb-854c-4585-9590-fa8a346ee8d5,2025-07-18T04:24:00Z,2025-07-18T04:25:00Z),
-- (f3ea6b41-6d5e-4fa4-b6f0-dbb741c76e4f,PromptMagic,Generate smart prompts,magic.png,aijunkie,10,18,"ai,wizard",ai,https://promptmagic.ai,1,ecfe400a-eb11-4ea9-aa8b-491408162925,2025-07-18T04:26:00Z,2025-07-18T04:27:00Z),
-- (fa0e2d68-401e-4f2d-a36f-e205e2ce8b5d,FocusApp,Task management tool,focus.png,focusme,8,25,"productive,focus",web,https://focus.app,4,5d5b9468-462b-417d-8dcb-eb1994d0e6f7,2025-07-18T04:28:00Z,2025-07-18T04:29:00Z),
-- (acfb86c1-b36b-494a-b798-fbf3b159b265,TutorBot,Learning AI assistant,tutor.png,codequeen,14,22,"smart,helper",education,https://tutorbot.ai,3,ce200c9b-29a2-423a-9c96-ad75532406f8,2025-07-18T04:30:00Z,2025-07-18T04:31:00Z),
-- (1f5e8916-5311-4e0b-a4c6-4e791bd66e61,FlutterEase,Optimize Flutter builds,flutter.png,flutter_ace,6,16,"flutter,snappy",mobile,https://flutterease.dev,3,f5570ab7-9d85-4e61-9f99-d2f2480cf539,2025-07-18T04:32:00Z,2025-07-18T04:33:00Z),
-- (a3a38a7f-2bb9-4045-bdb0-04e745b48838,WebScout,Best web frameworks,scout.png,builderhub,11,14,"explorer,web",tools,https://webscout.io,2,b6953cd2-47d9-4cac-9e53-557b6593e87c,2025-07-18T04:34:00Z,2025-07-18T04:35:00Z),
-- (2f2b9174-b1fc-4092-98a9-e3e5fd100ea3,ToolboxX,Dev tool manager,toolbox.png,nerdybyte,9,28,"tools,geeky",tools,https://toolboxx.dev,5,71146e1e-c09b-428d-90d6-1ba3515fa87b,2025-07-18T04:36:00Z,2025-07-18T04:37:00Z),
-- (631e97b2-1e5e-4b66-8473-8f09e1c2c4c1,FriendZone,Connect and share,social.png,gamegod,7,17,"social,community",community,https://friendzone.social,1,cbef089c-9e81-4540-a734-95cdbc2d7eb6,2025-07-18T04:38:00Z,2025-07-18T04:39:00Z);

-- INSERT INTO  product_tags (product_id,tag_id) VALUES
-- (bddf5b71-7e21-44cc-b798-b12a66746b07,201d624b-4229-4b19-9b9e-6e9ffecf2e3d),
-- (c4d4dd8b-b947-470b-a5e5-517dbdbf371d,cf25d2ad-4ea3-4fe2-943d-5e3b91ed7716),
-- (5d5095a6-070b-40d9-a79c-3e0ec0dba8a9,f8de3a1b-b3fd-4c5e-8e8e-ec8dc0349d4f),
-- (f3ea6b41-6d5e-4fa4-b6f0-dbb741c76e4f,b0e2a609-a02c-402b-9f6d-b1de7ed6c64d),
-- (fa0e2d68-401e-4f2d-a36f-e205e2ce8b5d,4f5462ad-28e0-491d-8ee4-2620b230bc7c),
-- (acfb86c1-b36b-494a-b798-fbf3b159b265,dc9edb6c-3e7e-4e6b-a0a9-b15cb9a2d6d4),
-- (1f5e8916-5311-4e0b-a4c6-4e791bd66e61,e02c9e17-40ef-4391-91b8-8ac8b08cd191),
-- (a3a38a7f-2bb9-4045-bdb0-04e745b48838,756fb9f5-c7d1-40e6-b42c-0b8b45f71f78),
-- (2f2b9174-b1fc-4092-98a9-e3e5fd100ea3,a1d34da9-e6cb-4ab2-879a-9c775cfa0d35),
-- (631e97b2-1e5e-4b66-8473-8f09e1c2c4c1,cf25d2ad-4ea3-4fe2-943d-5e3b91ed7716);


-- INSERT INTO user_badges (id,user_id,badge_id,earned_at) VALUES
-- (011eabda-0a00-4a00-8000-111111111111,ab6028c7-a72a-4464-9e87-ec01f7c17317,3efba2b8-3c95-466e-b787-9e89a33b544a,2025-07-18T05:10:00Z),
-- (011eabda-0a00-4a00-8000-222222222222,d09d001d-6e9d-4597-bc3b-f5991f7aefad,0ff9d85e-c823-4ca6-b825-11d4f5b94d3a,2025-07-18T05:11:00Z),
-- (011eabda-0a00-4a00-8000-333333333333,459cfafb-854c-4585-9590-fa8a346ee8d5,1a2c748c-6d83-4534-9101-306e038e5b0b,2025-07-18T05:12:00Z),
-- (011eabda-0a00-4a00-8000-444444444444,ecfe400a-eb11-4ea9-aa8b-491408162925,b0d6a4cc-b537-4e13-a1fa-1b49cfc3036b,2025-07-18T05:13:00Z),
-- (011eabda-0a00-4a00-8000-555555555555,cbef089c-9e81-4540-a734-95cdbc2d7eb6,9bbf0d3f-02dc-4b6e-9e4b-6d09ff1ccfc0,2025-07-18T05:14:00Z),
-- (011eabda-0a00-4a00-8000-666666666666,f5570ab7-9d85-4e61-9f99-d2f2480cf539,49fc75f3-343b-4cb3-963e-2090e9388be0,2025-07-18T05:15:00Z),
-- (011eabda-0a00-4a00-8000-777777777777,71146e1e-c09b-428d-90d6-1ba3515fa87b,2cfac13f-2b88-4c9f-9f79-b621c9288cdd,2025-07-18T05:16:00Z),
-- (011eabda-0a00-4a00-8000-888888888888,ce200c9b-29a2-423a-9c96-ad75532406f8,cc1817b7-b499-41f4-bd63-9d3a10b7290f,2025-07-18T05:17:00Z),
-- (011eabda-0a00-4a00-8000-999999999999,b6953cd2-47d9-4cac-9e53-557b6593e87c,ea5029d7-a2f7-40e3-b3d5-57d5f9d31571,2025-07-18T05:18:00Z),
-- (011eabda-0a00-4a00-8000-aaaaaaaabbbb,5d5b9468-462b-417d-8dcb-eb1994d0e6f7,190eabdc-2c31-48e5-a685-80870ae66212,2025-07-18T05:19:00Z);


-- INSERT INTO product_upvotes (id,user_id,product_id,created_at) VALUES
-- (5e7a91d3-caff-4560-840f-bec6efc24c11,ab6028c7-a72a-4464-9e87-ec01f7c17317,uuid-prod-1,2025-07-18T05:20:00Z),
-- (6fa60214-1c25-43ad-84a5-5a95d1b8a134,d09d001d-6e9d-4597-bc3b-f5991f7aefad,uuid-prod-2,2025-07-18T05:21:00Z),
-- (350c356c-356d-4035-884b-29c4ce22860f,459cfafb-854c-4585-9590-fa8a346ee8d5,uuid-prod-3,2025-07-18T05:22:00Z),
-- (3ae9722e-6d38-4bb8-bec4-2b1b1e0118a0,ecfe400a-eb11-4ea9-aa8b-491408162925,uuid-prod-4,2025-07-18T05:23:00Z),
-- (759f85f3-294e-4021-b7b7-990bbf8a641e,cbef089c-9e81-4540-a734-95cdbc2d7eb6,uuid-prod-5,2025-07-18T05:24:00Z),
-- (d295cb24-8f8e-4e10-b08f-6072b8eb11e5,f5570ab7-9d85-4e61-9f99-d2f2480cf539,uuid-prod-6,2025-07-18T05:25:00Z),
-- (72d99f3c-9614-4290-80ce-cd73efec6852,71146e1e-c09b-428d-90d6-1ba3515fa87b,uuid-prod-7,2025-07-18T05:26:00Z),
-- (d5e36043-0f08-481e-a6e1-4bb5fc54b65c,ce200c9b-29a2-423a-9c96-ad75532406f8,uuid-prod-8,2025-07-18T05:27:00Z),
-- (08701f9d-f1cb-41c7-baba-7687295c5f7b,b6953cd2-47d9-4cac-9e53-557b6593e87c,uuid-prod-9,2025-07-18T05:28:00Z),
-- (2cc9cb2a-a7be-4f7c-a383-14b1d419b6a3,5d5b9468-462b-417d-8dcb-eb1994d0e6f7,uuid-prod-10,2025-07-18T05:29:00Z);


INSERT INTO tags (id, name, color) VALUES
('201d624b-4229-4b19-9b9e-6e9ffecf2e3d', 'JavaScript', '#f7df1e'),
('dc9edb6c-3e7e-4e6b-a0a9-b15cb9a2d6d4', 'Flutter', '#02569B'),
('b0e2a609-a02c-402b-9f6d-b1de7ed6c64d', 'AI', '#6E00FF'),
('edc2de4b-335f-4346-8b3c-fb5ae0e7a9ed', 'Productivity', '#00C49A'),
('4f5462ad-28e0-491d-8ee4-2620b230bc7c', 'Web', '#3366CC'),
('f8de3a1b-b3fd-4c5e-8e8e-ec8dc0349d4f', 'Design', '#FF4081'),
('756fb9f5-c7d1-40e6-b42c-0b8b45f71f78', 'DevTools', '#FF9800'),
('e02c9e17-40ef-4391-91b8-8ac8b08cd191', 'Mobile', '#009688'),
('a1d34da9-e6cb-4ab2-879a-9c775cfa0d35', 'Community', '#8E24AA'),
('cf25d2ad-4ea3-4fe2-943d-5e3b91ed7716', 'Education', '#3F51B5');

INSERT INTO badges (id, name, description, icon) VALUES
('3efba2b8-3c95-466e-b787-9e89a33b544a', 'Speedy', 'Awarded for lightning-fast execution', '⚡'),
('0ff9d85e-c823-4ca6-b825-11d4f5b94d3a', 'Strategist', 'Given for top-tier planning', '🧠'),
('1a2c748c-6d83-4534-9101-306e038e5b0b', 'Helper', 'Awarded for assisting peers', '🤝'),
('b0d6a4cc-b537-4e13-a1fa-1b49cfc3036b', 'Explorer', 'Explored 10+ tools', '🧭'),
('9bbf0d3f-02dc-4b6e-9e4b-6d09ff1ccfc0', 'Innovator', 'Launched a unique product', '💡'),
('49fc75f3-343b-4cb3-963e-2090e9388be0', 'Contributor', 'Posted multiple high-rated items', '📬'),
('2cfac13f-2b88-4c9f-9f79-b621c9288cdd', 'Socialite', 'Engaged with 10+ users', '📢'),
('cc1817b7-b499-41f4-bd63-9d3a10b7290f', 'Optimizer', 'Improved a product’s score by 30%', '🎯'),
('ea5029d7-a2f7-40e3-b3d5-57d5f9d31571', 'Achiever', 'Received 50+ upvotes', '🏅'),
('190eabdc-2c31-48e5-a685-80870ae66212', 'Visionary', 'Consistently forward-thinking', '🔮');

INSERT INTO categories (id, name, slug, description, icon, created_at) VALUES
('e522b6ec-1d02-4e5e-9034-d3ab18b8f3e1', 'Tech', 'tech', 'All tech-related stuff', '🔧', '2025-07-18T04:00:00Z'),
('7c53bb6f-8b1b-42c9-b3a6-a2e4fdc14b8f', 'Gaming', 'gaming', 'Games and gear', '🎮', '2025-07-18T04:05:00Z'),
('a0f9ad2b-ec18-430a-8512-8d7199e1ec7a', 'Design', 'design', 'Creative tools and tips', '🎨', '2025-07-18T04:10:00Z'),
('f146f3a7-b96f-4d60-92c7-d354d92e3512', 'AI', 'ai', 'Artificial intelligence tools', '🤖', '2025-07-18T04:15:00Z'),
('32a05cb4-8fd0-4f98-a2ae-5d0a6f986b03', 'Productivity', 'productivity', 'Work smarter guides', '📈', '2025-07-18T04:20:00Z'),
('a4b21964-e7c2-4e33-863e-177d06f3a4b5', 'Education', 'education', 'Learning resources', '📚', '2025-07-18T04:25:00Z'),
('88ecb18f-b145-4429-a607-7092df4d5fcf', 'Mobile', 'mobile', 'Apps and platforms', '📱', '2025-07-18T04:30:00Z'),
('b302e5cb-2a17-4cc0-bc3c-3c7f2ddab3f9', 'Web', 'web', 'Web dev resources', '🌐', '2025-07-18T04:35:00Z'),
('4de8a16e-3d3c-4ef0-bac6-3f5293fbc6e3', 'Tools', 'tools', 'Developer tools', '🛠️', '2025-07-18T04:40:00Z'),
('49c18eaf-9523-471e-b30c-735f43c1c783', 'Community', 'community', 'Social & collaborative', '👥', '2025-07-18T04:45:00Z');


-- INSERT INTO profiles (id, username, created_at) VALUES
-- ('ab6028c7-a72a-4464-9e87-ec01f7c17317', 'niki_dev', '2025-07-18T04:10:00Z'),
-- ('d09d001d-6e9d-4597-bc3b-f5991f7aefad', 'janedoe', '2025-07-18T04:11:00Z'),
-- ('459cfafb-854c-4585-9590-fa8a346ee8d5', 'devkit', '2025-07-18T04:12:00Z'),
-- ('ecfe400a-eb11-4ea9-aa8b-491408162925', 'aijunkie', '2025-07-18T04:13:00Z'),
-- ('cbef089c-9e81-4540-a734-95cdbc2d7eb6', 'gamegod', '2025-07-18T04:14:00Z'),
-- ('f5570ab7-9d85-4e61-9f99-d2f2480cf539', 'flutter_ace', '2025-07-18T04:15:00Z'),
-- ('71146e1e-c09b-428d-90d6-1ba3515fa87b', 'nerdybyte', '2025-07-18T04:16:00Z'),
-- ('ce200c9b-29a2-423a-9c96-ad75532406f8', 'codequeen', '2025-07-18T04:17:00Z'),
-- ('b6953cd2-47d9-4cac-9e53-557b6593e87c', 'builderhub', '2025-07-18T04:18:00Z'),
-- ('5d5b9468-462b-417d-8dcb-eb1994d0e6f7', 'focusme', '2025-07-18T04:19:00Z');

-- INSERT INTO notifications (id, user_id, type, message, read, created_at, link) VALUES
-- ('b8f282fd-49d1-4912-a28f-0d37a70f594e', 'ab6028c7-a72a-4464-9e87-ec01f7c17317', 'info', 'Your product got upvoted!', false, '2025-07-18T05:00:00Z', 'https://speed.io'),
-- ('f7de9a8d-8457-4da1-9899-13cd88f11b50', 'd09d001d-6e9d-4597-bc3b-f5991f7aefad', 'reminder', 'Complete your profile', true, '2025-07-18T05:01:00Z', 'https://profile.io'),
-- ('e1f3f802-c05b-4e81-a3a8-ef49e037e56d', '459cfafb-854c-4585-9590-fa8a346ee8d5', 'promotion', 'Check out CleanUI', false, '2025-07-18T05:02:00Z', 'https://cleanui.dev'),
-- ('a1808eec-1de8-498a-af27-4c1272374e8e', 'ecfe400a-eb11-4ea9-aa8b-491408162925', 'info', 'New comment on PromptMagic', true, '2025-07-18T05:03:00Z', 'https://promptmagic.ai'),
-- ('27ec1fd2-eaac-4b52-9cd6-bbe1f8a3568b', 'cbef089c-9e81-4540-a734-95cdbc2d7eb6', 'update', 'FriendZone just got updated', false, '2025-07-18T05:04:00Z', 'https://friendzone.social'),
-- ('fcd7f211-a592-41f7-a02f-21dc5ffdb305', 'f5570ab7-9d85-4e61-9f99-d2f2480cf539', 'info', 'FlutterEase reached 500 users!', true, '2025-07-18T05:05:00Z', 'https://flutterease.dev'),
-- ('d61f2c1b-c1fa-4ee0-bd08-d6d3066b4693', '71146e1e-c09b-428d-90d6-1ba3515fa87b', 'warning', 'ToolboxX needs verification', false, '2025-07-18T05:06:00Z', 'https://toolboxx.dev'),
-- ('d3a3b1cb-e62a-4ff6-96b8-efbb83e4e6b6', 'ce200c9b-29a2-423a-9c96-ad75532406f8', 'info', 'TutorBot added new topics', true, '2025-07-18T05:07:00Z', 'https://tutorbot.ai'),
-- ('eb5e3f9f-228b-4aa7-8e5b-badcbcf942e8', 'b6953cd2-47d9-4cac-9e53-557b6593e87c', 'promotion', 'Get 50% off WebScout', false, '2025-07-18T05:08:00Z', 'https://webscout.io'),
-- ('a63f54a7-35aa-48ec-a735-e11212cc3512', '5d5b9468-462b-417d-8dcb-eb1994d0e6f7', 'reminder', 'FocusApp session overdue', true, '2025-07-18T05:09:00Z', 'https://focus.app');


-- INSERT INTO products (
--   id, name, description, image, author, points, upvotes, badges,
--   category, link, peer_push_points, user_id, created_at, updated_at
-- ) VALUES
-- ('bddf5b71-7e21-44cc-b798-b12a66746b07', 'Speed Booster', 'Improves performance', 'speed.png', 'niki_dev', 12, 30, '{speedy,top}', 'tech', 'https://speed.io', 5, 'ab6028c7-a72a-4464-9e87-ec01f7c17317', '2025-07-18T04:20:00Z', '2025-07-18T04:21:00Z'),
-- ('c4d4dd8b-b947-470b-a5e5-517dbdbf371d', 'XP Amplifier', 'Increases EXP gain', 'xp.png', 'janedoe', 5, 12, '{rare,elite}', 'education', 'https://xpboost.io', 3, 'd09d001d-6e9d-4597-bc3b-f5991f7aefad', '2025-07-18T04:22:00Z', '2025-07-18T04:23:00Z'),
-- ('5d5095a6-070b-40d9-a79c-3e0ec0dba8a9', 'CleanUI', 'Minimal design tools', 'ui.png', 'devkit', 15, 20, '{sleek,design}', 'design', 'https://cleanui.dev', 2, '459cfafb-854c-4585-9590-fa8a346ee8d5', '2025-07-18T04:24:00Z', '2025-07-18T04:25:00Z'),
-- ('f3ea6b41-6d5e-4fa4-b6f0-dbb741c76e4f', 'PromptMagic', 'Generate smart prompts', 'magic.png', 'aijunkie', 10, 18, '{ai,wizard}', 'ai', 'https://promptmagic.ai', 1, 'ecfe400a-eb11-4ea9-aa8b-491408162925', '2025-07-18T04:26:00Z', '2025-07-18T04:27:00Z'),
-- ('fa0e2d68-401e-4f2d-a36f-e205e2ce8b5d', 'FocusApp', 'Task management tool', 'focus.png', 'focusme', 8, 25, '{productive,focus}', 'web', 'https://focus.app', 4, '5d5b9468-462b-417d-8dcb-eb1994d0e6f7', '2025-07-18T04:28:00Z', '2025-07-18T04:29:00Z'),
-- ('acfb86c1-b36b-494a-b798-fbf3b159b265', 'TutorBot', 'Learning AI assistant', 'tutor.png', 'codequeen', 14, 22, '{smart,helper}', 'education', 'https://tutorbot.ai', 3, 'ce200c9b-29a2-423a-9c96-ad75532406f8', '2025-07-18T04:30:00Z', '2025-07-18T04:31:00Z'),
-- ('1f5e8916-5311-4e0b-a4c6-4e791bd66e61', 'FlutterEase', 'Optimize Flutter builds', 'flutter.png', 'flutter_ace', 6, 16, '{flutter,snappy}', 'mobile', 'https://flutterease.dev', 3, 'f5570ab7-9d85-4e61-9f99-d2f2480cf539', '2025-07-18T04:32:00Z', '2025-07-18T04:33:00Z'),
-- ('a3a38a7f-2bb9-4045-bdb0-04e745b48838', 'WebScout', 'Best web frameworks', 'scout.png', 'builderhub', 11, 14, '{explorer,web}', 'tools', 'https://webscout.io', 2, 'b6953cd2-47d9-4cac-9e53-557b6593e87c', '2025-07-18T04:34:00Z', '2025-07-18T04:35:00Z'),
-- ('2f2b9174-b1fc-4092-98a9-e3e5fd100ea3', 'ToolboxX', 'Dev tool manager', 'toolbox.png', 'nerdybyte', 9, 28, '{tools,geeky}', 'tools', 'https://toolboxx.dev', 5, '71146e1e-c09b-428d-90d6-1ba3515fa87b', '2025-07-18T04:36:00Z', '2025-07-18T04:37:00Z'),
-- ('631e97b2-1e5e-4b66-8473-8f09e1c2c4c1', 'FriendZone', 'Connect and share', 'social.png', 'gamegod', 7, 17, '{social,community}', 'community', 'https://friendzone.social', 1, 'cbef089c-9e81-4540-a734-95cdbc2d7eb6', '2025-07-18T04:38:00Z', '2025-07-18T04:39:00Z');



-- INSERT INTO product_tags (product_id, tag_id) VALUES
-- ('bddf5b71-7e21-44cc-b798-b12a66746b07', '201d624b-4229-4b19-9b9e-6e9ffecf2e3d'),
-- ('c4d4dd8b-b947-470b-a5e5-517dbdbf371d', 'cf25d2ad-4ea3-4fe2-943d-5e3b91ed7716'),
-- ('5d5095a6-070b-40d9-a79c-3e0ec0dba8a9', 'f8de3a1b-b3fd-4c5e-8e8e-ec8dc0349d4f'),
-- ('f3ea6b41-6d5e-4fa4-b6f0-dbb741c76e4f', 'b0e2a609-a02c-402b-9f6d-b1de7ed6c64d'),
-- ('fa0e2d68-401e-4f2d-a36f-e205e2ce8b5d', '4f5462ad-28e0-491d-8ee4-2620b230bc7c'),
-- ('acfb86c1-b36b-494a-b798-fbf3b159b265', 'dc9edb6c-3e7e-4e6b-a0a9-b15cb9a2d6d4'),
-- ('1f5e8916-5311-4e0b-a4c6-4e791bd66e61', 'e02c9e17-40ef-4391-91b8-8ac8b08cd191'),
-- ('a3a38a7f-2bb9-4045-bdb0-04e745b48838', '756fb9f5-c7d1-40e6-b42c-0b8b45f71f78'),
-- ('2f2b9174-b1fc-4092-98a9-e3e5fd100ea3', 'a1d34da9-e6cb-4ab2-879a-9c775cfa0d35'),
-- ('631e97b2-1e5e-4b66-8473-8f09e1c2c4c1', 'cf25d2ad-4ea3-4fe2-943d-5e3b91ed7716');


-- INSERT INTO user_badges (id, user_id, badge_id, earned_at) VALUES
-- ('011eabda-0a00-4a00-8000-111111111111', 'ab6028c7-a72a-4464-9e87-ec01f7c17317', '3efba2b8-3c95-466e-b787-9e89a33b544a', '2025-07-18T05:10:00Z'),
-- ('011eabda-0a00-4a00-8000-222222222222', 'd09d001d-6e9d-4597-bc3b-f5991f7aefad', '0ff9d85e-c823-4ca6-b825-11d4f5b94d3a', '2025-07-18T05:11:00Z'),
-- ('011eabda-0a00-4a00-8000-333333333333', '459cfafb-854c-4585-9590-fa8a346ee8d5', '1a2c748c-6d83-4534-9101-306e038e5b0b', '2025-07-18T05:12:00Z'),
-- ('011eabda-0a00-4a00-8000-444444444444', 'ecfe400a-eb11-4ea9-aa8b-491408162925', 'b0d6a4cc-b537-4e13-a1fa-1b49cfc3036b', '2025-07-18T05:13:00Z'),
-- ('011eabda-0a00-4a00-8000-555555555555', 'cbef089c-9e81-4540-a734-95cdbc2d7eb6', '9bbf0d3f-02dc-4b6e-9e4b-6d09ff1ccfc0', '2025-07-18T05:14:00Z'),
-- ('011eabda-0a00-4a00-8000-666666666666', 'f5570ab7-9d85-4e61-9f99-d2f2480cf539', '49fc75f3-343b-4cb3-963e-2090e9388be0', '2025-07-18T05:15:00Z'),
-- ('011eabda-0a00-4a00-8000-777777777777', '71146e1e-c09b-428d-90d6-1ba3515fa87b', '2cfac13f-2b88-4c9f-9f79-b621c9288cdd', '2025-07-18T05:16:00Z'),
-- ('011eabda-0a00-4a00-8000-888888888888', 'ce200c9b-29a2-423a-9c96-ad75532406f8', 'cc1817b7-b499-41f4-bd63-9d3a10b7290f', '2025-07-18T05:17:00Z'),
-- ('011eabda-0a00-4a00-8000-999999999999', 'b6953cd2-47d9-4cac-9e53-557b6593e87c', 'ea5029d7-a2f7-40e3-b3d5-57d5f9d31571', '2025-07-18T05:18:00Z'),
-- ('011eabda-0a00-4a00-8000-aaaaaaaabbbb', '5d5b9468-462b-417d-8dcb-eb1994d0e6f7', '190eabdc-2c31-48e5-a685-80870ae66212', '2025-07-18T05:19:00Z');

-- INSERT INTO product_upvotes (id, user_id, product_id, created_at) VALUES
-- ('5e7a91d3-caff-4560-840f-bec6efc24c11', 'ab6028c7-a72a-4464-9e87-ec01f7c17317', 'bddf5b71-7e21-44cc-b798-b12a66746b07', '2025-07-18T05:20:00Z'),
-- ('6fa60214-1c25-43ad-84a5-5a95d1b8a134', 'd09d001d-6e9d-4597-bc3b-f5991f7aefad', 'c4d4dd8b-b947-470b-a5e5-517dbdbf371d', '2025-07-18T05:21:00Z'),
-- ('350c356c-356d-4035-884b-29c4ce22860f', '459cfafb-854c-4585-9590-fa8a346ee8d5', '5d5095a6-070b-40d9-a79c-3e0ec0dba8a9', '2025-07-18T05:22:00Z'),
-- ('3ae9722e-6d38-4bb8-bec4-2b1b1e0118a0', 'ecfe400a-eb11-4ea9-aa8b-491408162925', 'f3ea6b41-6d5e-4fa4-b6f0-dbb741c76e4f', '2025-07-18T05:23:00Z'),
-- ('759f85f3-294e-4021-b7b7-990bbf8a641e', 'cbef089c-9e81-4540-a734-95cdbc2d7eb6', '631e97b2-1e5e-4b66-8473-8f09e1c2c4c1', '2025-07-18T05:24:00Z'),
-- ('d295cb24-8f8e-4e10-b08f-6072b8eb11e5', 'f5570ab7-9d85-4e61-9f99-d2f2480cf539', '1f5e8916-5311-4e0b-a4c6-4e791bd66e61', '2025-07-18T05:25:00Z'),
-- ('72d99f3c-9614-4290-80ce-cd73efec6852', '71146e1e-c09b-428d-90d6-1ba3515fa87b', '2f2b9174-b1fc-4092-98a9-e3e5fd100ea3', '2025-07-18T05:26:00Z'),
-- ('d5e36043-0f08-481e-a6e1-4bb5fc54b65c', 'ce200c9b-29a2-423a-9c96-ad75532406f8', 'acfb86c1-b36b-494a-b798-fbf3b159b265', '2025-07-18T05:27:00Z'),
-- ('08701f9d-f1cb-41c7-baba-7687295c5f7b', 'b6953cd2-47d9-4cac-9e53-557b6593e87c', 'a3a38a7f-2bb9-4045-bdb0-04e745b48838', '2025-07-18T05:28:00Z'),
-- ('2cc9cb2a-a7be-4f7c-a383-14b1d419b6a3', '5d5b9468-462b-417d-8dcb-eb1994d0e6f7', 'fa0e2d68-401e-4f2d-a36f-e205e2ce8b5d', '2025-07-18T05:29:00Z');


