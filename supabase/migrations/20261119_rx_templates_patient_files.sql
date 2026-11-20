-- Prescription plan templates per clinic (stored like the other clinic lists) and a private bucket for X-ray / CBCT / DICOM files.
alter table public.clinic_lists drop constraint clinic_lists_kind_check;
alter table public.clinic_lists add constraint clinic_lists_kind_check check (kind = any (array['dis','proc','fin','stock','rxt']));

insert into storage.buckets(id,name,public,file_size_limit)
values('patient-files','patient-files',false,52428800) on conflict (id) do nothing;

create policy patient_files_read on storage.objects for select to authenticated using (bucket_id='patient-files' and (private.my_role()='admin' or (private.my_role() in ('manager','doctor','nurse','reception') and (storage.foldername(name))[1]=private.my_clinic())));
create policy patient_files_ins on storage.objects for insert to authenticated with check (bucket_id='patient-files' and private.my_role() in ('manager','doctor','nurse','reception') and (storage.foldername(name))[1]=private.my_clinic() and lower(name) ~ '\.(dcm|zip|pdf|stl|ply|obj|jpg|jpeg|png)$');
create policy patient_files_del on storage.objects for delete to authenticated using (bucket_id='patient-files' and (private.my_role()='admin' or (private.my_role() in ('manager','doctor','nurse') and (storage.foldername(name))[1]=private.my_clinic())));
